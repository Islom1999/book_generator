#!/usr/bin/env bash
# Deploys Ertaklar on this server with PM2 (see deploy/README.md).
# Run from the repo checkout (/root/book_generator) after `git pull`:
#   bash deploy/server-deploy.sh
# Idempotent: safe to run on every deploy.
#
#   api     pm2 ertaklar-v2-api     127.0.0.1:3700  -> api.ertaklar.anisaplus.uz
#   worker  pm2 ertaklar-v2-worker
#   bot     pm2 ertaklar-v2-bot     (only when TELEGRAM_BOT_TOKEN is set)
#   client  pm2 ertaklar-v2-client  127.0.0.1:4010  -> ertaklar.anisaplus.uz
#   admin   static files in nginx                   -> admin.ertaklar.anisaplus.uz
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE=/root/ertaklar
ENV_FILE=$BASE/.env
API_DOMAIN=api.ertaklar.anisaplus.uz
ADMIN_DOMAIN=admin.ertaklar.anisaplus.uz
CLIENT_DOMAIN=ertaklar.anisaplus.uz
ADMIN_ROOT=/var/www/$ADMIN_DOMAIN
API_PORT=3700
CLIENT_PORT=4010
REDIS_PORT=6381
CERT_EMAIL=${CERT_EMAIL:-ismoilov3600@gmail.com}
# npm 10 crashes on this tree (edgesOut bug), so npm 11 is used.
NPM=(npx -y npm@11)

log() { echo "==> $*"; }
die() { echo "ERROR: $*" >&2; exit 1; }

command -v pm2 >/dev/null || die "pm2 is not installed"
command -v nginx >/dev/null || die "nginx is not installed"
command -v docker >/dev/null || die "docker is not installed (used only for the Redis container)"

# 1. Config: generated once, never in git ----------------------------------
mkdir -p "$BASE/storage"
if [ ! -f "$ENV_FILE" ]; then
  log "Creating $ENV_FILE with generated secrets"
  umask 077
  cat > "$ENV_FILE" <<ENV
# PostgreSQL (existing server): fill in DB_PASSWORD, and DB_USER/DB_NAME if different.
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=ertaklar
DB_PASSWORD=
DB_NAME=ertaklar_app
DB_LOGGING=false

# Redis (BullMQ): dedicated container started by this script
REDIS_HOST=127.0.0.1
REDIS_PORT=$REDIS_PORT
REDIS_PASSWORD=

JWT_SECRET=$(openssl rand -hex 32)
ADMIN_JWT_EXPIRES_IN=12h
USER_JWT_EXPIRES_IN=30d
ADMIN_EMAIL=admin@ertaklar.uz
ADMIN_PASSWORD=$(openssl rand -base64 18 | tr -d '/+=')

CORS_ORIGINS=https://$ADMIN_DOMAIN,https://$CLIENT_DOMAIN
CLIENT_URL=https://$CLIENT_DOMAIN
PUBLIC_API_URL=https://$API_DOMAIN

STORAGE_DRIVER=local
STORAGE_LOCAL_DIR=$BASE/storage

GOOGLE_CLIENT_ID=
TELEGRAM_BOT_TOKEN=
OPENROUTER_API_KEY=
REPLICATE_API_TOKEN=
ENV
fi

# shellcheck disable=SC1090
set -a; . "$ENV_FILE"; set +a
[ -n "${DB_PASSWORD:-}" ] || die "DB_PASSWORD is empty in $ENV_FILE. Fill in the PostgreSQL settings (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME) and rerun."

# 2. Redis (own container, bound to localhost; the shared one on :6379 belongs to another project)
if ! docker inspect ertaklar-redis >/dev/null 2>&1; then
  log "Starting Redis container ertaklar-redis on 127.0.0.1:$REDIS_PORT"
  docker run -d --name ertaklar-redis --restart unless-stopped \
    -p 127.0.0.1:$REDIS_PORT:6379 -v ertaklar-redis-data:/data \
    redis:7-alpine redis-server --appendonly yes --maxmemory-policy noeviction >/dev/null
else
  docker start ertaklar-redis >/dev/null 2>&1 || true
fi

# 3. Backend: build, migrate ------------------------------------------------
log "Building backend"
cd "$REPO/backend"
"${NPM[@]}" ci --no-audit --no-fund
npm run build
npm run db:build
log "Running migrations"
node --env-file="$ENV_FILE" node_modules/typeorm/cli.js -d dist/db/database/src/data-source.js migration:run

# 4. Admin panel and client: build ------------------------------------------
log "Building admin panel"
cd "$REPO/admin"
"${NPM[@]}" ci --no-audit --no-fund --legacy-peer-deps
npx ng build

log "Building client"
cd "$REPO/client"
"${NPM[@]}" ci --no-audit --no-fund --legacy-peer-deps
npx ng build

# 5. Start / reload processes -------------------------------------------------
log "Starting processes with pm2"
cd "$REPO"
if [ -n "${TELEGRAM_BOT_TOKEN:-}" ]; then
  APPS="ertaklar-v2-api,ertaklar-v2-worker,ertaklar-v2-bot,ertaklar-v2-client"
else
  APPS="ertaklar-v2-api,ertaklar-v2-worker,ertaklar-v2-client"
  pm2 delete ertaklar-v2-bot >/dev/null 2>&1 || true
fi
pm2 startOrReload deploy/ecosystem.config.cjs --only "$APPS" --update-env

log "Waiting for API and client"
wait_for() {
  for _ in $(seq 1 60); do curl -fsS "$1" >/dev/null 2>&1 && return 0; sleep 2; done
  return 1
}
if ! wait_for "http://127.0.0.1:$API_PORT/api/health"; then
  pm2 logs ertaklar-v2-api --lines 60 --nostream || true
  die "API did not become healthy; nginx and the legacy API were left untouched"
fi
if ! wait_for "http://127.0.0.1:$CLIENT_PORT/"; then
  pm2 logs ertaklar-v2-client --lines 60 --nostream || true
  die "Client did not start; nginx and the legacy API were left untouched"
fi

# 6. Admin static files + nginx (only reached when the new stack is healthy) ---
log "Publishing admin panel"
mkdir -p "$ADMIN_ROOT" /var/www/certbot
rsync -a --delete "$REPO/admin/dist/fuse/browser/" "$ADMIN_ROOT/"

log "Configuring nginx"
for pair in "$API_DOMAIN:api.conf" "$ADMIN_DOMAIN:admin.conf" "$CLIENT_DOMAIN:client.conf"; do
  domain=${pair%%:*}
  conf=${pair##*:}
  target=/etc/nginx/sites-available/$domain.conf
  # Once installed (and given its HTTPS block by certbot) the file is left
  # alone so redeploys don't drop HTTPS. To apply a changed deploy/nginx/*.conf,
  # delete the file in /etc/nginx/sites-available and redeploy.
  if [ -f "$target" ] && grep -q '^# ertaklar-v2' "$target"; then
    :
  else
    [ -f "$target" ] && cp "$target" "$target.bak-$(date +%Y%m%d%H%M%S)"
    install -m 644 "$REPO/deploy/nginx/$conf" "$target"
  fi
  ln -sf "$target" "/etc/nginx/sites-enabled/$domain.conf"
done
nginx -t
systemctl reload nginx

for domain in $API_DOMAIN $ADMIN_DOMAIN $CLIENT_DOMAIN; do
  log "HTTPS for $domain"
  certbot --nginx -d "$domain" --non-interactive --agree-tos -m "$CERT_EMAIL" \
    --redirect --keep-until-expiring \
    || echo "WARN: certbot failed for $domain (DNS not propagated yet?); rerun the deploy later"
done
nginx -t
systemctl reload nginx

pm2 save >/dev/null
log "Done"
pm2 list | grep -E 'name|ertaklar-v2' || true
