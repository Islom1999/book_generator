# Deploy (94.130.33.123, PM2)

| Domen | Nima | Qanday ishlaydi |
| --- | --- | --- |
| `ertaklar.anisaplus.uz` | Mijoz sayti | Angular SSR, pm2 `ertaklar-v2-client` (`127.0.0.1:4010`), `/api/` → API |
| `api.ertaklar.anisaplus.uz` | NestJS API | pm2 `ertaklar-v2-api` (`127.0.0.1:3700`) |
| `admin.ertaklar.anisaplus.uz` | Admin panel | statik fayllar (nginx), `/api/` → API |

Qo'shimcha pm2 jarayonlar: `ertaklar-v2-worker` (BullMQ), `ertaklar-v2-bot`
(faqat `TELEGRAM_BOT_TOKEN` bo'lsa). Redis: alohida Docker konteyner
`ertaklar-redis` (`127.0.0.1:6381`). PostgreSQL: serverda tayyor turgan baza.

## Birinchi marta

1. DNS: uchala domen `94.130.33.123` ga yo'naltirilgan bo'lishi kerak.
2. PostgreSQL'da baza va foydalanuvchi yarating (o'zingizning parolingiz bilan):

   ```sql
   CREATE USER ertaklar WITH PASSWORD '<parol>';
   CREATE DATABASE ertaklar_app OWNER ertaklar;
   ```

3. Deploy skriptini ishga tushiring. Birinchi ishga tushishda u
   `/root/ertaklar/.env` ni yaratadi (JWT secret va admin paroli tasodifiy) va
   `DB_PASSWORD` bo'sh bo'lgani uchun to'xtaydi:

   ```bash
   bash /root/book_generator/deploy/server-deploy.sh
   ```

4. `/root/ertaklar/.env` da `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`,
   `DB_NAME` ni to'ldiring va skriptni qayta ishga tushiring.

Skript: backend/admin/client build → migratsiyalar → pm2 → sog'liq tekshiruvi →
nginx + Let's Encrypt. API yoki client ishga tushmasa, nginx'ga tegilmaydi.

## Keyingi deploylar

`main` ga push qilinganda `.github/workflows/deploy.yml` serverda `git pull` va
shu skriptni ishga tushiradi. Qo'lda: `cd /root/book_generator && git pull &&
bash deploy/server-deploy.sh`.

GitHub → Settings → Secrets and variables → Actions: `SSH_PRIVATE_KEY`
(tavsiya) yoki `SSH_PRIVATE_PASSWORD`.

## Birinchi kirish

Admin login: `.env` dagi `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Kirgandan keyin
parolni o'zgartiring.

```bash
grep ^ADMIN_ /root/ertaklar/.env
```

## Foydali buyruqlar

```bash
pm2 list | grep ertaklar-v2
pm2 logs ertaklar-v2-api --lines 100
pm2 restart ertaklar-v2-api
```

## Eslatmalar

- nginx konfiglari (`deploy/nginx/*.conf`) birinchi o'rnatilgandan keyin
  serverda `/etc/nginx/sites-available/` da certbot bilan birga turadi va qayta
  yozilmaydi. O'zgartirish uchun o'sha faylni o'chirib, deploy'ni qayta
  ishga tushiring (eskisining `.bak-*` nusxasi qoladi).
- Eski sayt va API (`ertaklar.topsites.uz`, pm2 `ertaklar-api`) bu deploy'ga bog'liq emas va tegilmaydi.
- Yuklangan fayllar `/root/ertaklar/storage` da (zaxira nusxaga qo'shing).
