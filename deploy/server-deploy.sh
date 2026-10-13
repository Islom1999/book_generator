#!/usr/bin/env bash
# Runs on the server (94.130.33.123) from the GitHub Actions deploy job.
# Expects the release unpacked in /root/ertaklar/release (backend/, deploy/, admin-dist/).
# Idempotent: safe to run on every deploy.
set -euo pipefail

BASE=/root/ertaklar
RELEASE=$BASE/release
ENV_FILE=$BASE/.env
API_DOMAIN=api.ertaklar.topsites.uz
ADMIN_DOMAIN=admin.ertaklar.topsites.uz
ADMIN_ROOT=/var/www/$ADMIN_DOMAIN
CERT_EMAIL=${CERT_EMAIL:-ismoilov3600@gmail.com}

log() { echo "==> $*"; }

# 1. Tools ---------------------------------------------------------------
if ! command -v docker >/dev/null; then
  log "Installing Docker"
  curl -fsSL https://get.docker.com | sh
fi
if ! command -v nginx >/dev/null; then
  log "Installing nginx"
  apt-get update -qq && apt-get install -y -qq nginx
fi
if ! command -v rsync >/dev/null; then
  apt-get update -qq && apt-get install -y -qq rsync
fi
if ! command -v certbot >/dev/null; then
  log "Installing certbot"
  apt-get update -qq && apt-get install -y -qq certbot python3-certbot-nginx
fi

# 2. Secrets: generated once, never in git -------------------------------
if [ ! -f "$ENV_FILE" ]; then
  log "Creating $ENV_FILE with generated secrets"
  umask 077
  cat > "$ENV_FILE" <<ENV
DB_USER=ertaklar
DB_PASSWORD=$(openssl rand -hex 24)
DB_NAME=ertaklar_app
JWT_SECRET=$(openssl rand -hex 32)
ADMIN_JWT_EXPIRES_IN=12h
USER_JWT_EXPIRES_IN=30d
ADMIN_EMAIL=admin@ertaklar.uz
ADMIN_PASSWORD=$(openssl rand -base64 18 | tr -d '/+=')
CORS_ORIGINS=https://$ADMIN_DOMAIN,https://ertaklar.topsites.uz
CLIENT_URL=https://ertaklar.topsites.uz
PUBLIC_API_URL=https://$API_DOMAIN
STORAGE_DRIVER=local
GOOGLE_CLIENT_ID=
TELEGRAM_BOT_TOKEN=
OPENROUTER_API_KEY=
REPLICATE_API_TOKEN=
ENV
  echo "First super admin: admin@ertaklar.uz, password in $ENV_FILE (ADMIN_PASSWORD)"
fi

# 3. Backend containers --------------------------------------------------
log "Building and starting containers"
cd "$RELEASE/deploy"
docker compose --env-file "$ENV_FILE" -f docker-compose.prod.yml up -d --build --remove-orphans
docker image prune -f >/dev/null

log "Waiting for the API"
for _ in $(seq 1 60); do
  if curl -fsS http://127.0.0.1:3100/api/health >/dev/null; then break; fi
  sleep 2
done
curl -fsS http://127.0.0.1:3100/api/health || {
  docker compose --env-file "$ENV_FILE" -f docker-compose.prod.yml logs --tail=80 migrate api
  exit 1
}
echo

# 4. Admin panel static files -------------------------------------------
log "Publishing admin panel"
mkdir -p "$ADMIN_ROOT" /var/www/certbot
rsync -a --delete "$RELEASE/admin-dist/" "$ADMIN_ROOT/"

# 5. nginx + HTTPS -------------------------------------------------------
log "Configuring nginx"
for domain in $API_DOMAIN $ADMIN_DOMAIN; do
  conf=api.conf
  [ "$domain" = "$ADMIN_DOMAIN" ] && conf=admin.conf
  install -m 644 "$RELEASE/deploy/nginx/$conf" "/etc/nginx/sites-available/$domain"
  ln -sf "/etc/nginx/sites-available/$domain" "/etc/nginx/sites-enabled/$domain"
done
nginx -t && systemctl reload nginx

# The config above is HTTP only; certbot (re)adds the HTTPS block and the
# redirect, reusing an existing certificate until it is close to expiry.
for domain in $API_DOMAIN $ADMIN_DOMAIN; do
  log "HTTPS for $domain"
  certbot --nginx -d "$domain" --non-interactive --agree-tos -m "$CERT_EMAIL" \
    --redirect --keep-until-expiring \
    || echo "WARN: certbot failed for $domain (DNS not propagated yet?); HTTP works, rerun deploy later"
done
nginx -t && systemctl reload nginx

log "Done"
docker compose --env-file "$ENV_FILE" -f "$RELEASE/deploy/docker-compose.prod.yml" ps
