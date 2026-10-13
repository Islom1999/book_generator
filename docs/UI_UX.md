# UI/UX qoidalari

Maqsad: har bir ekran telefonda (375 px) ham, kompyuterda (1440 px) ham
birinchi topshirishdayoq to'g'ri ishlashi. To'liq qoidalar va tekshiruv
ro'yxati Claude agentlari uchun `.claude/skills/ui-ux/SKILL.md` da (ingliz
tilida). Bu yerda asosiy tamoyillar.

## Tamoyillar

1. **Avval telefon.** Bitta ustundan boshlanadi, keng ekranda kengayadi.
   Sahifa hech qachon yonga surilmaydi.
2. **Har bir holat bor:** yuklanmoqda, bo'sh, xato, ruxsat yo'q, muvaffaqiyat.
   Bo'sh ekran o'rniga tushuntirish va tugma.
3. **Ikki marta bosish mumkin emas.** Pul, buyurtma holati va generatsiya
   tugmalari bosilgandan keyin bloklanadi.
4. **Formalar:** label doim ko'rinadi, xato maydon tagida, Enter yuboradi,
   telefon `+998` bilan, telefonda maydonlar katta (barmoq bilan bosiladigan).
5. **Format:** `125 000 so'm`, `09.10.2026`, `+998 90 123 45 67`,
   Toshkent vaqti. Bitta umumiy helper orqali.
6. **Ranglar faqat mavzu (theme) tokenlaridan.** Ma'no faqat rang bilan
   berilmaydi. Buyurtma holatlari hamma joyda bir xil rangda.
7. **Hamma matn tarjimada** (uz, ru, en). Ruscha matn ~30% uzunroq — sinovda
   uzun matn bilan tekshiriladi.
8. **Klaviatura va fokus ishlaydi**, ikonka tugmalarida yozuv bor.

## Admin panel

Xodimlar asosan kompyuterda, lekin telefondan ham tez ko'ra olishi kerak.
Jadval o'z ichida suriladi, muhim ustunlar birinchi. Telefonda dialoglar
butun ekranni egallaydi. Moderatsiya ekranida asl surat va generatsiya
yonma-yon (telefonda ustma-ust), klaviatura tugmalari bilan.

## Mijoz sayti

Ota-onalar telefonda, ko'pincha **Telegram ichidagi brauzerda**. U yerda
Google bilan kirish ishlamaydi, shuning uchun Telegram orqali kirish birinchi
taklif qilinadi. Wizard: telefonda har qadam alohida ekranda, orqaga
qaytganda ma'lumot yo'qolmaydi. Surat yuklashda yaxshi/yomon namunalar.
Preview yuklab olinmaydi.

## Tekshiruv

```bash
node .claude/skills/ui-ux/responsive-check.mjs --base http://localhost:4300 \
  --paths /reference/regions --login admin --out /tmp/ui-check
```

Skript sahifalarni telefon, planshet va desktop o'lchamida suratga oladi va
yonga surilish, ekrandan chiqib ketgan elementlar, kichik tugmalar, konsol
xatolari va muvaffaqiyatsiz so'rovlarni ko'rsatadi. Keyin suratlar ko'z
bilan ko'rib chiqiladi.
