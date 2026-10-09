# Yo'l xaritasi

## 0-bosqich — poydevor ✅

- [x] Eski MVP `legacy/` ga ko'chirildi (deploy workflow yo'li yangilandi)
- [x] NestJS 12 monorepo: `api`, `worker`, `bot`, `libs/common`, `libs/database`
- [x] PostgreSQL migratsiyalari (`synchronize` o'chirilgan), boshlang'ich ma'lumotlar: tillar, 14 viloyat, sozlamalar
- [x] Fuse admin bilan mos generic CRUD (pagination, filtr, arxiv, tiklash)
- [x] Admin auth + rollar (RBAC), birinchi super admin avtomatik yaratiladi
- [x] Mijoz auth: Google, Telegram Login Widget (HMAC tekshiruvi testlangan)
- [x] Dinamik tillar (`jsonb` tarjimalar)
- [x] Admin panel (Fuse): kirish, menyu, uz/ru/en, CRUD sahifalari: tillar,
      viloyatlar, tumanlar, pochta bo'limlari, sozlamalar, adminlar, mijozlar
- [x] Worker (BullMQ) va bot (grammY) skeletlari, Redis

## 1-bosqich — asosiy oqim

Backend:
- [ ] Fayl storage (MinIO/S3), signed URL, watermark
- [ ] Kitob shablonlari: `book_templates`, `template_pages`, `book_formats`
- [ ] Bola profillari, surat yuklash va sifat tekshiruvi
- [ ] Trial generatsiya: telefon bo'yicha limit, AI byudjeti, navbat orqali
- [ ] OpenRouter/Replicate pipeline'ni `legacy/api` dan worker'ga ko'chirish, `generation_logs`
- [ ] Buyurtma va holatlar zanjiri, `order_status_history`
- [ ] Ledger balans (to'lov tizimisiz: admin qo'lda to'ldiradi, audit bilan)
- [ ] Moderatsiya API: sahifani qayta generatsiya qilish, matnni tahrirlash, tasdiqlash yoki rad etish
- [ ] Telegram bot: deep-link login, telefon ulashish, status bildirishnomalari
- [ ] Audit log

Admin:
- [ ] Shablon konstruktori (sahifalar, til va jins variantlari, preview)
- [ ] Buyurtmalar jadvali va kartochkasi, ommaviy status o'zgartirish
- [ ] Moderatsiya ekrani (sahifama-sahifa, asl surat bilan yonma-yon)
- [ ] Dashboard: buyurtmalar, tushum, AI xarajati, trial → order konversiyasi
- [ ] Fuse demo vidjetlarini (chat, xabarlar, bildirishnomalar) olib tashlash yoki haqiqiysiga almashtirish

Client (yangi `client/` ilova, Angular SSR + Tailwind + PrimeNG):
- [ ] Landing va kitob sahifalari (SEO)
- [ ] Google va Telegram orqali kirish, profil, manzil
- [ ] Trial wizard → preview → buyurtma
- [ ] Balans va buyurtmalar tarixi, buyurtma kuzatuvi

## 2-bosqich — ishga tushirish

- [ ] Bosma hamkor bilan integratsiya: print-PDF batch, ZIP eksport
- [ ] Logistika: jo'natmalar, trek raqam (BTS), pochta indeksi bo'yicha manzil
- [ ] Payme va Click (YaTT/MChJ ochilgandan keyin)
- [ ] Promokodlar, referal bonuslar
- [ ] Ommaviy oferta, rozilik, suratlarni avtomatik o'chirish
- [ ] Monitoring (Sentry), zaxira nusxalar, CI/CD

## 3-bosqich — o'sish

- [ ] Telegram Mini App
- [ ] Sovg'a sertifikatlari, sovg'a sifatida boshqa manzilga yuborish
- [ ] Sharhlar, analitika

## Ochiq savollar

- Bosma hamkor va kitob formati (o'lcham, sahifa soni, muqova, narx)
- Shablon rasmlari: illustrator chizadimi yoki AI'da tayyorlanadimi
- Yuridik shaxs (Payme/Click uchun)
- Shaxsiy ma'lumotlar lokalizatsiyasi va Hetzner (ARCHITECTURE.md, 1-bo'lim)
