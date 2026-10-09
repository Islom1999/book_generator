# Ertaklar.uz

Bola bosh qahramon bo'lgan shaxsiylashtirilgan ertak kitoblari: AI yordamida
yaratiladi va bosma shaklda yetkaziladi.

- Biznes-logika: [docs/BUSINESS_LOGIC.md](docs/BUSINESS_LOGIC.md)
- Arxitektura va qarorlar: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Bosqichlar va vazifalar: [docs/ROADMAP.md](docs/ROADMAP.md)

## Tuzilma

| Papka | Nima |
| --- | --- |
| `backend/` | NestJS monorepo: `api`, `worker`, `bot` + `libs/` |
| `admin/` | Fuse admin panel (Angular 20, PrimeNG) |
| `legacy/` | Eski MVP, faqat ma'lumot uchun |
| `docs/` | Hujjatlar |
| `.claude/` | Claude Code sozlamalari: skill'lar va subagentlar |

## Lokal ishga tushirish

Talablar: Node.js 22+, npm 11+ (`npx npm@11` ham bo'ladi), Docker.

```bash
# 1) PostgreSQL (localhost:55433) va Redis (localhost:6379)
docker compose up -d

# 2) Backend
cd backend
cp .env.example .env
npm install
npm run migration:run
npm run start:api        # http://localhost:3000/api, Swagger: /api/docs
npm run start:worker     # alohida terminalda
npm run start:bot        # TELEGRAM_BOT_TOKEN bo'lsa

# 3) Admin panel
cd admin
npm install
npm start -- --port 4300 # http://localhost:4300
```

Admin panelga kirish: `.env` dagi `ADMIN_EMAIL` / `ADMIN_PASSWORD`
(standart qiymatlari `admin@ertaklar.uz` / `admin12345`). Birinchi super admin
API birinchi marta ishga tushganda yaratiladi.

## Backend buyruqlari

| Buyruq | Vazifasi |
| --- | --- |
| `npm run typecheck` | TypeScript tekshiruvi |
| `npm run lint` | oxlint |
| `npm test` | vitest |
| `npm run build` | api, worker, bot build |
| `npm run migration:generate --name=AddOrders` | entity o'zgarishidan migratsiya yaratish |
| `npm run migration:run` / `migration:revert` | migratsiyalarni qo'llash yoki bekor qilish |

Baza sxemasi faqat migratsiyalar orqali o'zgaradi (`synchronize` o'chirilgan).
