# Ertaklar.uz — biznes-logika

Bu hujjat tizim **qanday ishlashi kerakligini** biznes qoidalari darajasida
tasvirlaydi: kim nima qila oladi, pul qanday harakatlanadi, buyurtma qanday
yo'lni bosib o'tadi. Texnik tuzilma [ARCHITECTURE.md](./ARCHITECTURE.md) da,
bosqichlar [ROADMAP.md](./ROADMAP.md) da.

Qoidalar:

- Kod shu hujjatga mos bo'lishi kerak. Qoida o'zgarsa, avval shu hujjat
  yangilanadi, keyin kod.
- Hozircha aniq bo'lmagan qiymatlar (narx, format, limitlar) kodga
  yozilmaydi. Ular `settings` jadvalida yoki spravochnikda turadi va admin
  paneldan o'zgartiriladi. Bunday joylar pastda `⚙ setting` deb belgilangan.
- **Taklif** deb belgilangan bandlar hali egasi tomonidan tasdiqlanmagan.

## 1. Mahsulot

Mijoz tayyor ertak shablonini tanlaydi, bolasining ismi va suratini
yuklaydi. AI bolani ertak qahramoniga aylantiradi. Tayyor kitob bosmaga
chiqariladi va mijoz tanlagan pochta bo'limiga yetkaziladi.

- Bozor: faqat O'zbekiston (boshlanishiga).
- Tillar: dinamik, asosan uz, ru, en. Kitob matni tanlangan tilda bo'ladi.
- Mijozga **PDF yoki yuqori sifatli fayl berilmaydi**. U faqat saytda
  watermarkli, past sifatli preview ko'radi. Daromad bosma kitobdan keladi.

## 2. Ishtirokchilar

| Kim | Tavsif |
| --- | --- |
| Mehmon | Ro'yxatdan o'tmagan. Landing, katalog, namunalarni ko'radi |
| Mijoz | Google yoki Telegram orqali kirgan ota-ona |
| Bola | Kitob qahramoni. Mijozning `child_profile` yozuvi, alohida akkaunt emas |
| Admin | Xodim. Rollar 9-bo'limda |
| Bosma hamkor | Tashqi. Print-fayllarni oladi (hozircha tanlanmagan) |
| Yetkazuvchi | Tashqi. Hozircha BTS |

## 3. Akkaunt

### 3.1. Kirish

- Usullar: Google yoki Telegram (Login Widget yoki bot deep-link).
- Parol yo'q. Bitta akkauntga ikkala usulni ham bog'lash mumkin.
- Birinchi kirishda faqat to'liq ism so'raladi (provayderdan olinadi,
  mijoz tahrirlay oladi). Boshqa ma'lumotlar kerak bo'lganda so'raladi.
- Bloklangan mijoz (`is_blocked`) tizimga kira olmaydi. Uning faol
  buyurtmalari to'xtatilmaydi, admin ularni qo'lda hal qiladi.

### 3.2. Telefon raqam

- Telefon **bepul sinovdan oldin** majburiy. Sabab: trial limiti telefonga
  bog'langan, aks holda bitta odam ko'p akkaunt ochib limitni chetlab o'tadi.
- Telefon faqat Telegram bot orqali kontakt ulashish bilan tasdiqlanadi
  (Telegram raqamni o'zi tasdiqlaydi, SMS kerak emas).
- Bitta telefon faqat bitta akkauntga bog'lanadi (`users.phone` unique).
  Raqam boshqa akkauntda bo'lsa, mijozga "bu raqam boshqa akkauntga bog'langan"
  deyiladi. Birlashtirishni faqat `customers.edit` ruxsati bor admin qiladi.
- Faqat `+998` raqamlar qabul qilinadi (boshlanishiga).

### 3.3. Profil va manzil

- Profil: to'liq ism, telefon, interfeys tili.
- Manzillar (`addresses`), bir nechta bo'lishi mumkin. Har biri:
  qabul qiluvchi ismi, telefon, viloyat → tuman → pochta bo'limi (indeks).
  Spravochnikda bo'lmagan joy uchun erkin matn maydoni (izoh).
- Manzil faqat buyurtma berishda majburiy.

### 3.4. Bola profili

- Maydonlar: ism (kitobda shunday yoziladi), jinsi (o'g'il/qiz), tug'ilgan
  yili, surat(lar).
- Bitta mijozda bir nechta bola bo'lishi mumkin. ⚙ `children.max_per_user` (taklif: 5).
- Surat yuklashda ota-ona **rozilik** belgisini qo'yadi (vaqti va IP saqlanadi).
- Surat sifati avtomatik tekshiriladi: yuz bitta, aniq, old tomondan,
  yetarli o'lchamda, yuzni to'sadigan narsa yo'q. O'tmasa, sababi
  ko'rsatiladi va qayta yuklash so'raladi.
- Asl suratlar ⚙ `photos.retention_days` (30) kundan keyin o'chiriladi:
  - buyurtma bo'lmasa — oxirgi trialdan keyin;
  - buyurtma bo'lsa — buyurtma `DELIVERED` yoki yopilgandan keyin.
  Generatsiya qilingan sahifalar qoladi (qayta bosma uchun).
- Mijoz bola profilini istalgan vaqtda o'chira oladi. Faol buyurtmadagi
  bola o'chirilmaydi (buyurtma yopilguncha).

## 4. Katalog va shablonlar

### 4.1. Kitob shabloni (`book_templates`)

- Nomi, tavsifi, muqova rasmi, namuna sahifalari (tarjima qilinadi).
- Yosh oralig'i (masalan 3–7), jinsi: o'g'il, qiz yoki ikkalasi.
- Mavjud tillar: shablon faqat barcha sahifalari tarjima qilingan tilda
  sotiladi.
- Holati: `draft` → `published` → `archived`.
  - `draft`: faqat adminlar ko'radi, test generatsiya qilish mumkin.
  - `published`: katalogda.
  - `archived`: katalogda yo'q, lekin mavjud buyurtmalar ishlayveradi.
- Nashr qilishdan oldin tekshiruv: har bir faol tilda har bir sahifa matni
  bor, har bir sahifada rasm va prompt bor, kamida bitta trial sahifa
  belgilangan, narx bor.
- Shablon o'zgarishi eski buyurtmalarga ta'sir qilmaydi: buyurtma
  yaratilganda shablon versiyasi (`template_version`) saqlanadi.

### 4.2. Sahifa (`template_pages`)

- Tartib raqami, sahifa turi: muqova, ichki sahifa, oxirgi muqova,
  bag'ishlov sahifasi.
- Matn variantlari: til × jins. Matnda o'zgaruvchilar: `{name}`, `{name_possessive}`
  (o'zbekchada qo'shimchalar uchun), `{age}`, bag'ishlov uchun `{dedication}`.
  O'zgaruvchilar ro'yxati qat'iy, noma'lum o'zgaruvchi bo'lsa shablon nashr
  qilinmaydi.
- Bazaviy illyustratsiya, AI uchun prompt, yuz qo'yiladigan zona.
- `is_trial` — bepul sinovda generatsiya qilinadigan sahifa.
- `is_personalized` — AI generatsiyasi kerakmi yoki statik sahifami.

### 4.3. Format (`book_formats`)

Hozircha aniq emas. Formatni spravochnik qilib qo'yamiz: o'lcham (mm),
muqova (yumshoq/qattiq), qog'oz, sahifa soni oralig'i, bosma tannarxi,
sotuv narxi. Shablon bir yoki bir nechta formatda sotilishi mumkin.

## 5. Bepul sinov (trial)

Maqsad: mijoz bolasini kitobda ko'rib, xarid qilishga ishonch hosil qilsin.

| Qoida | Qiymat |
| --- | --- |
| Kim | Tizimga kirgan, telefoni tasdiqlangan mijoz |
| Nechta kitob | ⚙ `trial.max_books` (3) — **telefon raqamga** umrbod |
| Har bir kitobda | ⚙ `trial.max_pages` (1–3) sahifa, shablondagi `is_trial` sahifalardan |
| Qayta generatsiya | ⚙ `trial.max_regenerations` (taklif: sahifaga 1 marta) |
| Bir vaqtda | Bitta mijozda bitta faol generatsiya |
| Natija | Past o'lcham, watermark, faqat saytda ko'rinadi |
| Saqlanish | ⚙ `trial.expires_days` (taklif: 30), keyin preview o'chadi |

- Trial hisobi generatsiya **muvaffaqiyatli tugaganda** yoziladi.
  AI xatosi yoki tizim xatosi limitni yemaydi.
- Bir xil bola + bir xil shablon uchun qayta trial ochilmaydi, mavjudi
  ko'rsatiladi.
- Kunlik AI byudjeti ⚙ `ai.daily_budget_usd` tugasa, yangi trial'lar
  ertasigacha to'xtaydi ("navbat to'la, ertaga urinib ko'ring").
  Pullik buyurtmalar byudjetdan qat'i nazar ishlayveradi.
- Trial'dan buyurtmaga o'tishda trial sahifalari buyurtmada qayta
  ishlatiladi (moderator baribir tekshiradi).
- Admin bitta mijozga qo'shimcha trial bera oladi (audit bilan).

## 6. Pul: balans (wallet)

### 6.1. Asosiy qoidalar

- Barcha summalar **tiyinda, butun son** (`bigint`). 1 so'm = 100 tiyin.
  Payme ham tiyinda ishlaydi. Valyuta faqat UZS.
- Balans maydon sifatida saqlanmaydi. U `wallet_transactions` yozuvlari
  yig'indisi. Yozuvlar o'zgartirilmaydi va o'chirilmaydi; xato faqat teskari
  yozuv bilan tuzatiladi.
- Har bir yozuvda `idempotency_key` bor. Bir xil kalit bilan ikkinchi yozuv
  yaratilmaydi (Payme callback'lari takrorlanadi).
- Balans manfiy bo'lishi mumkin emas. Yechish tranzaksiya ichida, balansni
  qulflab (`SELECT ... FOR UPDATE` wallet qatori) tekshiriladi.

### 6.2. Tranzaksiya turlari

| Tur | Belgi | Kim yaratadi |
| --- | --- | --- |
| `TOPUP` | + | To'lov tizimi callback'i (Payme/Click) |
| `ORDER_CHARGE` | − | Buyurtma to'lanishi |
| `REFUND` | + | Buyurtma bekor bo'lishi yoki qaytarish |
| `BONUS` | + | Promokod, referal, kompensatsiya |
| `ADJUSTMENT` | ± | Faqat `wallet.adjust` ruxsati bor admin, sababi majburiy |

### 6.3. Bonus pul

Bonus balansdan buyurtma uchun foydalanish mumkin, lekin uni naqd qaytarib
bo'lmaydi. Shuning uchun ikki "cho'ntak": `main` va `bonus`. Buyurtmada
avval bonus, keyin asosiy balans yechiladi. Qaytarishda pul qaysi
cho'ntakdan kelgan bo'lsa, o'shanga qaytadi.

### 6.4. To'ldirish

- To'lov tizimi ulanmaguncha (yuridik shaxs ochilmaguncha) balansni faqat
  `wallet.adjust` ruxsati bor admin qo'lda to'ldiradi (`ADJUSTMENT`, sabab: "naqd/karta o'tkazma",
  chek raqami). Shu bilan to'liq oqimni ishga tushirib sinash mumkin.
- Payme/Click ulanganda: mijoz summani kiritadi → to'lov sahifasi →
  callback → `payments` holati → muvaffaqiyatda `TOPUP`.
  Minimal summa ⚙ `wallet.min_topup`.
- Buyurtmada balans yetmasa, mijozga yetmagan summa ko'rsatiladi va
  to'ldirishga yo'naltiriladi. To'ldirilgandan keyin buyurtma qayta
  tasdiqlanadi (avtomatik yechilmaydi).

### 6.5. Pulni naqd qaytarish

Mijoz balansdagi `main` pulni qaytarishni so'rashi mumkin (ariza).
`wallet.withdraw` ruxsati bor admin qo'lda ko'rib chiqadi. Bu ommaviy ofertada yoziladi. Avtomatik naqd
qaytarish yo'q.

## 7. Buyurtma

### 7.1. Buyurtma berish

1. Mijoz shablon, format, til va bolani tanlaydi.
2. Bag'ishlov matnini kiritadi (ixtiyoriy, uzunligi cheklangan, moderatsiyadan
   o'tadi).
3. Manzilni tanlaydi yoki qo'shadi.
4. Narx ko'rsatiladi: kitob + yetkazish − chegirma.
5. "To'lash" bosiladi → balansdan yechiladi → buyurtma `PAID`.

Narxlar buyurtmada **qotiriladi** (`price_snapshot`): keyin narx o'zgarsa,
eski buyurtma o'zgarmaydi. Buyurtma raqami odam o'qiy oladigan bo'ladi:
`ERT-000123`.

Bitta buyurtmada bir nechta kitob bo'lishi mumkin (`order_items`), har biri
o'z bolasi va shabloni bilan. Yetkazish buyurtma uchun bitta.

### 7.2. Holatlar

```
PAID → GENERATING → MODERATION ⇄ REWORK → [CUSTOMER_REVIEW] → APPROVED
     → PRINT_QUEUE → PRINTING → PRINTED → SHIPPED → DELIVERED
yon tarmoqlar: ON_HOLD, CANCELLED, REFUNDED, RETURNED
```

| Holat | Ma'nosi | Kim o'tkazadi (ruxsat) |
| --- | --- | --- |
| `PAID` | Pul yechildi | Tizim |
| `GENERATING` | AI barcha sahifalarni yaratyapti | Worker |
| `MODERATION` | Moderator tekshiryapti | Worker |
| `REWORK` | Ba'zi sahifalar qayta generatsiyada | `moderation.regenerate` |
| `CUSTOMER_REVIEW` | Mijoz preview'ni tasdiqlaydi (⚙ `order.customer_review_enabled`) | `moderation.review` |
| `APPROVED` | Bosmaga tayyor, print-PDF yaratiladi | `moderation.review`, mijoz yoki taymer |
| `PRINT_QUEUE` | Bosma partiyasiga kiritildi | `print.manage` |
| `PRINTING` | Hamkor bosyapti | `print.manage` |
| `PRINTED` | Bosildi, sifat tekshirildi | `print.manage` |
| `SHIPPED` | Jo'natildi, trek raqam bor | `shipping.manage` |
| `DELIVERED` | Yetkazildi | `shipping.manage` yoki BTS integratsiyasi |
| `ON_HOLD` | Mijozdan javob kutilmoqda (masalan, yangi surat) | `orders.hold` |
| `CANCELLED` | Bekor qilindi | Mijoz yoki `orders.cancel` |
| `REFUNDED` | Pul balansga qaytarildi | Tizim (bekor qilishdan keyin) |
| `RETURNED` | Pochtadan olinmay qaytdi | `shipping.manage` |

Qoidalar:

- Holat faqat ruxsat etilgan o'tishlar bo'yicha o'zgaradi (kodda bitta
  joyda jadval sifatida). Har bir o'zgarish `order_status_history` ga
  yoziladi: kim, qachon, qaysi holatdan, izoh.
- Har bir o'zgarishda mijozga bildirishnoma ketadi (bot va/yoki email).
- `CUSTOMER_REVIEW`: mijoz ⚙ `order.customer_review_hours` (48) soat
  ichida javob bermasa, avtomatik `APPROVED`. Mijoz o'zgartirish so'rasa →
  `MODERATION` (⚙ `order.max_customer_revisions`, 1).

### 7.3. Bekor qilish va qaytarish

| Qachon | Kim | Natija |
| --- | --- | --- |
| `APPROVED` dan oldin | Mijoz o'zi | To'liq summa balansga (`REFUND`) |
| `APPROVED` dan `PRINTING` gacha | `orders.cancel` | Admin qaroriga ko'ra to'liq yoki qisman |
| `PRINTING` dan keyin | Bekor qilinmaydi | — |
| Bosma nuqsoni, shikastlanish | `orders.cancel` | Bepul qayta bosma yoki qaytarish |
| `RETURNED` (olinmagan) | `shipping.manage` | Qayta jo'natish (yetkazish pulini mijoz to'laydi) yoki yetkazishsiz qaytarish |

Pul har doim **balansga** qaytadi (6.5 ga qarang).

### 7.4. Muddatlar (SLA)

⚙ settings orqali, admin dashboardda kechikkanlar qizil:

- generatsiya: 1 soat ichida;
- moderatsiya: 24 soat ichida;
- bosmaga yuborish: tasdiqdan keyin 2 ish kuni;
- yetkazish: BTS muddati (3–7 kun).

## 8. Moderatsiya

Har bir buyurtma bosmadan oldin moderatordan o'tadi. Avtomatik o'tkazib
yuborish yo'q.

Moderator ekrani: chapda bolaning asl surati, o'ngda generatsiya qilingan
sahifa, pastda sahifa matni.

Tekshiruv ro'yxati:

- yuz bolaga o'xshaydi, yoshi va jinsi to'g'ri;
- AI nuqsonlari yo'q (ortiqcha barmoq, buzilgan ko'z, artefakt);
- ismi to'g'ri yozilgan, qo'shimchalar to'g'ri;
- bag'ishlov matni odobli;
- noo'rin kontent yo'q.

Amallar:

- sahifani tasdiqlash;
- sahifani qayta generatsiya qilish (prompt'ga izoh bilan; ⚙ `moderation.max_regenerations_per_page`);
- matnni qo'lda tahrirlash (faqat shu buyurtma uchun);
- mijozdan yangi surat so'rash → `ON_HOLD`, mijozga xabar;
- butun buyurtmani tasdiqlash (faqat hamma sahifa tasdiqlanganda).

Har bir sahifaning barcha versiyalari saqlanadi. Qaysi versiya bosmaga
ketgani belgilanadi.

## 9. Admin ruxsatlari (permission-based)

Ruxsatlar **dinamik**: rollarni `super_admin` admin panelda yaratadi va
ularga ruxsatlarni belgilaydi. Kodda faqat ruxsatlar katalogi qat'iy
(endpoint ruxsat kalitini tekshiradi, rol nomini emas).

- `admin_roles`: nomi (tarjima), tavsif, ruxsatlar ro'yxati, faolligi.
- Adminga bitta rol biriktiriladi (taklif: keyinchalik bir nechta).
- `is_super_admin` belgili admin har qanday tekshiruvdan o'tadi. Kamida bitta
  faol super admin doim qoladi (oxirgisini o'chirib yoki bloklab bo'lmaydi).
- Admin o'ziga ruxsat qo'sha olmaydi (o'z rolini tahrirlay olmaydi).
- Rol yoki ruxsat o'zgarishi darhol kuchga kiradi (har so'rovda tekshiriladi,
  tokenga yozilmaydi) va audit'ga tushadi.
- Admin panel menyusi va tugmalari ruxsatlarga qarab ko'rsatiladi.

Ruxsatlar katalogi (yangi funksiya qo'shilganda kengayadi):

| Guruh | Ruxsatlar |
| --- | --- |
| Adminlar | `admins.view`, `admins.manage`, `roles.manage` |
| Spravochniklar | `languages.manage`, `settings.manage`, `addresses.manage` |
| Mijozlar | `customers.view`, `customers.edit`, `customers.block`, `customers.grant_trial` |
| Katalog | `templates.view`, `templates.manage`, `formats.manage` |
| Buyurtmalar | `orders.view`, `orders.cancel`, `orders.hold` |
| Moderatsiya | `moderation.review`, `moderation.regenerate`, `moderation.edit_text` |
| Bosma va yetkazish | `print.manage`, `print.download`, `shipping.manage` |
| Moliya | `wallet.view`, `wallet.adjust`, `wallet.withdraw`, `payments.view`, `reports.finance` |
| Boshqa | `dashboard.view`, `audit.view` |

Boshlang'ich rollar (seed, keyin admin panelda o'zgartiriladi):

| Rol | Ruxsatlar |
| --- | --- |
| Super admin | hammasi (`is_super_admin`) |
| Moderator | `moderation.*`, `orders.view`, `customers.view`, `dashboard.view` |
| Operator | `orders.*`, `customers.*`, `addresses.manage`, `dashboard.view` |
| Logistika | `print.*`, `shipping.manage`, `orders.view`, `addresses.manage` |
| Moliya | `wallet.*`, `payments.view`, `reports.finance`, `customers.view`, `orders.cancel` |

Shablonlarni (`templates.manage`, `formats.manage`) hozircha faqat super admin
boshqaradi; alohida "kontent" rolini keyin admin panelda yaratish mumkin.

Har bir admin amali (`audit_logs`): kim, nima, qaysi yozuv, oldingi va
yangi qiymat. Pul va holat o'zgarishlari audit'siz bo'lmaydi.

## 10. Bosma va yetkazish

- Tasdiqlangan buyurtma uchun worker print-PDF yaratadi: upscale, 300 DPI,
  bleed, CMYK. Aniq parametrlar hamkor tanlangach (⚙ format spravochnigida).
- `print.manage` ruxsati bor admin tasdiqlanganlarni **bosma partiyasiga** (`print_batches`)
  yig'adi va ZIP eksport qiladi (yoki hamkor API'si orqali yuboradi).
- Print-fayl faqat admin panelda, `print.download` ruxsati bilan, muddatli havola
  bilan yuklanadi. Har bir yuklab olish audit'ga yoziladi.
- Bosilgandan keyin sifat tekshiruvi (`PRINTED`). Nuqson bo'lsa qayta bosma.
- Jo'natish: BTS, mijoz tanlagan bo'limga. Trek raqam kiritiladi
  (`shipments`), mijozga xabar ketadi.
- Yetkazish narxi: ⚙ `delivery.price` (hamma joyga bir xil) yoki keyinroq
  viloyat bo'yicha.

## 11. Fayl xavfsizligi (sizib chiqishga qarshi)

- Mijozga ko'rinadigan rasmlar: past o'lcham (⚙ `preview.max_px`, taklif: 800),
  watermark, qisqa muddatli signed URL.
- To'liq o'lchamli sahifalar va print-PDF private storage'da. Mijoz API'si
  ularga hech qanday yo'l bermaydi.
- Preview sahifalariga rate-limit.
- Bu to'liq himoya emas (skrinshotni to'xtatib bo'lmaydi), lekin bosma
  sifatidagi faylni olishning imkoni yo'q.

## 12. Bildirishnomalar

Kanal: Telegram bot (asosiy), email (Google orqali kirganlar uchun).

Hodisalar:

- trial tayyor;
- buyurtma to'landi;
- moderatsiyadan o'tdi yoki yangi surat kerak;
- mijoz tasdig'i kutilmoqda;
- jo'natildi (trek raqam bilan);
- yetkazildi;
- balans to'ldirildi;
- pul qaytarildi.

Matnlar tarjima qilinadi va mijoz tilida yuboriladi. Marketing xabarlari
faqat mijoz rozilik bergan bo'lsa.

## 13. Promokod va referal (2-bosqich)

- Promokod: foiz yoki summa, amal qilish muddati, umumiy va bir mijozga
  limit, minimal buyurtma summasi, ma'lum shablonlarga.
- Referal: taklif qilingan do'st birinchi buyurtmasini to'lagandan keyin
  ikkalasiga `BONUS`. ⚙ `referral.bonus_amount`.

## 14. Dashboard (admin)

- Bugun / hafta / oy: buyurtmalar soni, tushum, o'rtacha chek.
- Voronka: kirdi → telefon tasdiqladi → trial → buyurtma.
- Holatlar bo'yicha buyurtmalar, SLA'dan kechikkanlar.
- AI xarajati: kunlik, buyurtmaga o'rtacha, trial'ga o'rtacha.
- Moderatsiyada rad etish sabablari, qayta generatsiya ulushi.
- Eng ko'p sotilgan shablonlar.

## 15. Sozlamalar ro'yxati

| Kalit | Boshlang'ich qiymat | Holat |
| --- | --- | --- |
| `trial.max_books` | 3 | ✅ seed |
| `trial.max_pages` | 3 | ✅ seed |
| `trial.max_regenerations` | 1 | taklif |
| `trial.expires_days` | 30 | taklif |
| `ai.daily_budget_usd` | 50 | ✅ seed |
| `photos.retention_days` | 30 | ✅ seed |
| `children.max_per_user` | 5 | taklif |
| `wallet.min_topup` | — | Payme ulanganda |
| `delivery.price` | — | hamkor tanlanganda |
| `order.customer_review_enabled` | true | tasdiqlandi |
| `order.customer_review_hours` | 48 | tasdiqlandi |
| `order.max_customer_revisions` | 1 | tasdiqlandi |
| `moderation.max_regenerations_per_page` | 3 | taklif |
| `preview.max_px` | 800 | taklif |
| `referral.bonus_amount` | — | 2-bosqich |

## 16. Huquqiy talablar

- Ommaviy oferta va maxfiylik siyosati: ro'yxatdan o'tishda rozilik.
- Bola suratini yuklashda ota-ona roziligi (3.4).
- Shaxsiy ma'lumotlarni O'zbekistonda saqlash (ARCHITECTURE.md, 1-bo'lim).
- Mijoz akkauntni o'chirishni so'rasa: shaxsiy ma'lumotlar va suratlar
  o'chiriladi, moliyaviy yozuvlar qonun talab qilgan muddat saqlanadi
  (anonimlashtirilgan holda).

## 17. Ochiq savollar

Hal qilinganlar: mijoz tasdig'i bosqichi bor (7.2), bonus pul alohida (6.3),
pul faqat balansga qaytadi (6.5, 7.3), admin huquqlari dinamik ruxsatlar
orqali (9).


- Kitob formati, sahifa soni, narx, bosma hamkor.
- Shablon rasmlari: illustrator yoki AI.
- Yetkazish narxi bir xilmi yoki viloyat bo'yicha.
