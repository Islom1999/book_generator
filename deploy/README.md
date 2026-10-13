# Deploy (94.130.33.123)

| Domen | Nima |
| --- | --- |
| `api.ertaklar.topsites.uz` | NestJS API (Docker, `127.0.0.1:3100`) |
| `admin.ertaklar.topsites.uz` | Admin panel (statik, nginx), `/api/` → API |
| `ertaklar.topsites.uz` | Hozircha eski (legacy) sayt, tegilmaydi |

## Qanday ishlaydi

1. `.github/workflows/deploy.yml` admin panelni GitHub runnerida build qiladi,
   `backend/`, `deploy/` va admin dist'ni `release.tgz` qilib serverga yuboradi.
2. Serverda `deploy/server-deploy.sh` ishga tushadi:
   - Docker, nginx, certbot, rsync yo'q bo'lsa o'rnatadi;
   - `/root/ertaklar/.env` ni **bir marta** yaratadi (DB parol, JWT secret,
     birinchi admin paroli tasodifiy generatsiya qilinadi);
   - `docker compose` bilan postgres, redis, migratsiyalar, api, worker, bot;
   - admin fayllarini `/var/www/admin.ertaklar.topsites.uz` ga ko'chiradi;
   - nginx konfiglari va Let's Encrypt sertifikati (`certbot --nginx`).

## Sozlash (bir marta)

GitHub → Settings → Secrets and variables → Actions:

- `SSH_PRIVATE_KEY` — serverga kiradigan SSH kalit (tavsiya), **yoki**
- `SSH_PRIVATE_PASSWORD` — root paroli.

Keyin Actions → "Deploy API + admin" → Run workflow (yoki branchga push).

## Qo'lda deploy (o'z kompyuteringizdan)

```bash
# repo ildizida, admin build qilingandan keyin (cd admin && npx ng build)
mkdir -p release && cp -r admin/dist/fuse/browser release/admin-dist
git archive HEAD backend deploy | tar -x -C release
tar -czf release.tgz -C release .
ssh root@94.130.33.123 'mkdir -p /root/ertaklar/incoming'
scp release.tgz root@94.130.33.123:/root/ertaklar/incoming/
ssh root@94.130.33.123 'rm -rf /root/ertaklar/release && mkdir -p /root/ertaklar/release \
  && tar -xzf /root/ertaklar/incoming/release.tgz -C /root/ertaklar/release \
  && bash /root/ertaklar/release/deploy/server-deploy.sh'
```

## Birinchi kirish

Admin login: `.env` dagi `ADMIN_EMAIL` / `ADMIN_PASSWORD`:

```bash
ssh root@94.130.33.123 'grep ^ADMIN_ /root/ertaklar/.env'
```

Kirgandan keyin parolni o'zgartiring.

## Foydali buyruqlar (serverda)

```bash
cd /root/ertaklar/release/deploy
docker compose --env-file /root/ertaklar/.env -f docker-compose.prod.yml ps
docker compose --env-file /root/ertaklar/.env -f docker-compose.prod.yml logs -f api
```

## Diqqat

Eski sayt (`ertaklar.topsites.uz`) ham `api.ertaklar.topsites.uz` ga murojaat
qiladi. Yangi API shu domenni egallagach eski saytning API so'rovlari ishlamaydi.
Yangi mijoz sayti tayyor bo'lguncha bunga e'tibor bering.
