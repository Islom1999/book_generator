# Ertaklar.uz — arxitektura

Bola bosh qahramon bo'lgan, AI yordamida shaxsiylashtirilgan va bosma
shaklda yetkaziladigan ertak kitoblari. Xizmat avval faqat O'zbekiston uchun.

Bu hujjat qabul qilingan qarorlar va tizim tuzilishini tasvirlaydi.
Biznes qoidalari [BUSINESS_LOGIC.md](./BUSINESS_LOGIC.md), bosqichlar va
vazifalar [ROADMAP.md](./ROADMAP.md) faylida.

## 1. Qabul qilingan qarorlar

| Mavzu | Qaror |
| --- | --- |
| Backend | NestJS 12 (ESM) monorepo: `api`, `worker`, `bot` ilovalari + `libs/` |
| Ma'lumotlar bazasi | PostgreSQL 16 + TypeORM 1.x, faqat **migratsiyalar** (`synchronize: false`) |
| Navbat | Redis + BullMQ (AI generatsiya, bosma tayyorlash, bildirishnomalar) |
| Admin panel | Angular 20 + Fuse (`fuse-schematics`), PrimeNG, Transloco |
| Client | Angular + Tailwind + PrimeNG, SSR (SEO uchun) — 1-bosqichda |
| Tillar | **Dinamik**: `languages` jadvali (boshlang'ich: uz, ru, en) |
| Kirish | Google va Telegram (widget + bot). Adminlar: email + parol |
| To'lov | Ichki balans (ledger), Payme/Click orqali to'ldiriladi — oxirgi bosqichlarda |
| PDF | Mijozga berilmaydi. Faqat watermarkli past sifatli preview |
| Bosma | Hamkor hali tanlanmagan; kitob formati ochiq savol |
| Yetkazish | Hamkor aniqlanmaguncha BTS orqali; manzil spravochnigi tayyor |
| Server | Hetzner (pastdagi xavfga qarang) |

### Ochiq xavf: shaxsiy ma'lumotlarni lokalizatsiya qilish

O'zbekiston qonunchiligi fuqarolarning shaxsiy ma'lumotlarini O'zbekiston
hududidagi serverlarda saqlashni talab qiladi. Bolalar surati, ism, telefon
va manzil shu toifaga kiradi. Hetzner esa Germaniya va Finlyandiyada joylashgan.

Ishga tushirishdan oldin yurist bilan aniqlashtirish kerak. Variantlar:

- shaxsiy ma'lumotlar bazasi va fayllarni O'zbekistondagi serverda saqlash
  (masalan, UzCloud yoki Uztelecom), ilovani esa Hetznerda qoldirish;
- hammasini O'zbekistonda joylashtirish.

Kod bunga tayyor: DB va fayl storage ulanishlari env orqali sozlanadi.

## 2. Repo tuzilishi

```
backend/           NestJS monorepo
  apps/api         REST API: mijoz (/api/...) va admin (/api/admin/...)
  apps/worker      BullMQ consumer: AI generatsiya, upscale, print-PDF
  apps/bot         Telegram bot (grammY)
  libs/database    Entity'lar, migratsiyalar, DataSource
  libs/common      Generic CRUD, guard'lar, DTO, navbat nomlari
admin/             Fuse admin panel (Angular)
client/            Mijoz sayti (1-bosqichda qo'shiladi)
legacy/            Eski MVP — faqat ma'lumot uchun, yangi kod bu yerga yozilmaydi
docs/              Shu hujjatlar
```

Nima uchun to'liq microservice emas: boshlang'ich bosqichda alohida ilovalar
(`api`, `worker`, `bot`) bitta repo va umumiy `libs` bilan yetarli. Ular
alohida process sifatida ishga tushadi va alohida masshtablanadi. Kod
ajratilgani uchun kerak bo'lganda alohida servisga chiqarish oson.

## 3. API konventsiyalari

- Prefiks `/api`. Admin endpointlari `/api/admin/*` ostida, `AdminAuth` guard bilan.
- JSON maydonlari `snake_case`. Bu Fuse `IBaseModel` kontrakti
  (`id`, `version_id`, `created_at`, `updated_at`, `deleted_at`).
- O'chirish **soft delete**: yozuv arxivga tushadi va tiklanishi mumkin.
- Har bir admin CRUD resursi Fuse `BaseCrudService` kutgan marshrutlarni beradi
  (`libs/common/src/crud/crud.controller.ts`):

| Marshrut | Vazifasi |
| --- | --- |
| `GET /` | hammasi |
| `POST /pagination` | jadval: `{ first, rows, sortField, sortOrder, filters, globalFilter }` → `{ count, data }` |
| `POST /pagination/archive` | arxiv jadvali |
| `GET /archive/:id` | arxivdagi yozuv |
| `GET /repair/:id` | arxivdan tiklash |
| `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | o'qish, yaratish, yangilash, arxivlash |

- Filtr va saralash faqat entity'ning haqiqiy ustunlarini qabul qiladi
  (SQL injection'dan himoya). `jsonb` tarjima ustunlarida qidiruv hamma
  tillarda birdan ishlaydi.
- Validatsiya: `class-validator`, `whitelist` + `forbidNonWhitelisted`.
- Rate-limit: global 120/min, login endpointlari 5–10/min.
- Swagger: `/api/docs` (faqat production bo'lmagan muhitda).

## 4. Autentifikatsiya va rollar

**Adminlar.** `POST /api/admin/auth/sign-in` → `{ accessToken, user }`.
Fuse sahifa qayta yuklanganda `sign-in-with-token` orqali tokenni yangilaydi
va admin hali faolligini tekshiradi. Birinchi super admin `.env` dagi
`ADMIN_EMAIL` / `ADMIN_PASSWORD` dan, `admin_users` bo'sh bo'lsa yaratiladi.

| Rol | Ruxsati |
| --- | --- |
| `super_admin` | hamma narsa (har qanday rol tekshiruvidan o'tadi) |
| `moderator` | kitob moderatsiyasi (1-bosqich) |
| `operator` | buyurtmalar, mijozlar, manzil spravochniklari |
| `logistics` | bosma va yetkazish, manzil spravochniklari |
| `finance` | to'lovlar, balanslar, mijozlar |

**Mijozlar.** `POST /api/auth/telegram` (Login Widget, HMAC tekshiruvi) va
`POST /api/auth/google` (ID token tekshiruvi). Birinchi kirishda `users` va
`user_identities` yaratiladi. Bitta foydalanuvchiga ikkala usulni ham
bog'lash mumkin.

Bepul sinov limiti telefon raqamga bog'lanadi (`users.phone`, unique).
Shunda bitta odam ko'p akkaunt ochib limitni chetlab o'ta olmaydi. Telefon
Telegram bot orqali kontakt ulashish bilan tasdiqlanadi (1-bosqich).

## 5. Dinamik tillar

- `languages` jadvali: `code`, `name`, `native_name`, `is_default`, `is_active`, `sort_order`.
- Tarjima qilinadigan matnlar `jsonb` ustunda saqlanadi:
  `{ "uz": "...", "ru": "...", "en": "..." }` (`Translatable` tipi).
  Yangi til qo'shish migratsiya talab qilmaydi.
- Admin formalari maydonlarni faol tillar ro'yxatidan quradi
  (`translatableFields()`); faqat asosiy til majburiy.
- Admin panel interfeysi tarjimalari: `admin/src/assets/i18n/{uz,ru,en}.json`.

## 6. Ma'lumotlar modeli

✅ — mavjud, ⏳ — rejada.

- ✅ `admin_users` (rol, faollik)
- ✅ `users`, `user_identities` (google/telegram)
- ✅ `languages`, `settings` (kalit → JSON qiymat: trial limitlari, AI byudjeti...)
- ✅ `regions` → `districts` → `post_offices` (manzil spravochnigi, indeks bilan)
- ⏳ `child_profiles`: bola ismi, jinsi, tug'ilgan yili, surati (surat muddati tugagach o'chiriladi)
- ⏳ `addresses`: mijoz manzillari (post office yoki kuryer manzili)
- ⏳ `book_templates` → `template_pages`: matn variantlari (til, jins), bazaviy rasm, prompt, yuz zonasi
- ⏳ `book_formats`: o'lcham, muqova, sahifa soni, narx
- ⏳ `personalizations` (trial yoki order) → `generated_pages` (versiyalar bilan)
- ⏳ `generation_logs`: har bir AI chaqiruvning narxi va davomiyligi
- ⏳ `wallets`, `wallet_transactions` (ledger: TOPUP, ORDER_CHARGE, REFUND, BONUS, ADJUSTMENT)
- ⏳ `payments`: Payme/Click tranzaksiya holatlari
- ⏳ `orders`, `order_items`, `order_status_history`
- ⏳ `print_batches`, `shipments` (trek raqam)
- ⏳ `audit_logs`: admin amallari

### Buyurtma holatlari

```
PAID → GENERATING → MODERATION ⇄ REWORK → [CUSTOMER_REVIEW] → APPROVED
     → PRINT_QUEUE → PRINTING → PRINTED → SHIPPED → DELIVERED
yon tarmoqlar: ON_HOLD, CANCELLED, REFUNDED (balansga), RETURNED
```

O'tish qoidalari va kim o'tkazishi: BUSINESS_LOGIC.md, 7.2.

### Balans (ledger)

Summalar tiyinda, `bigint`. Balans alohida maydonda saqlanmaydi,
`wallet_transactions` yig'indisidan hisoblanadi. Har bir yozuv idempotent (`idempotency_key`). Pul qaytarib
olinmaydigan oldindan to'lov sifatida ofertada ko'rsatiladi.

## 7. AI pipeline (worker)

1. Mijoz surati yuklanadi, sifati tekshiriladi (MVP'dagi photo inspection).
2. Trial: 1–3 sahifa, past o'lcham, watermark.
3. Buyurtma: barcha sahifalar generatsiya qilinadi, keyin moderatsiyaga tushadi.
4. Moderator sahifani qayta generatsiya qilishi yoki matnni tahrirlashi mumkin.
5. Tasdiqlangach: upscale, 300 DPI, 3 mm bleed, CMYK, print-ready PDF.
   Bu fayl faqat bosma bo'limiga beriladi.

Provayderlar (OpenRouter, Replicate) interfeys orqali ulanadi, almashtirish
mumkin. Kunlik AI byudjeti (`ai.daily_budget_usd`) oshsa, yangi trial
generatsiyalar to'xtatiladi.

## 8. Fayllar

S3-compatible storage (MinIO yoki provayder). Original suratlar va bosma
fayllar private bo'ladi. Mijozga faqat muddatli signed URL orqali watermarkli
preview ko'rsatiladi.
