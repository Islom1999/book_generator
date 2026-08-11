# Ertaklar.uz — MVP

Personalized children’s storybooks (WonderWraps-style) for Uzbekistan.

**Stack:** Angular 19 · NestJS · PostgreSQL · TypeORM · OpenRouter

## What the MVP does

1. Catalog of 3 seeded books
2. Wizard: name, gender, age, photo, language (UZ/RU), dedication
3. OpenRouter writes the story and draws preview pages (child photo as reference)
4. Cart + checkout (cash on delivery)
5. Admin at `/admin` to see orders

Remaining pages are generated after the order is placed.

## Run locally

```bash
# 1) Postgres
docker compose up -d
# Postgres is on localhost:55432 (avoids clashing with other local Postgres instances)

# 2) API  (http://localhost:3000/api)
cd api
cp .env.example .env   # then set OPENROUTER_API_KEY
npm install
npm run start:dev

# 3) Web  (http://localhost:4200)
cd web
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

### Admin

- URL: http://localhost:4200/admin
- Email: `admin@ertaklar.uz`
- Password: `admin123` (change in `api/.env`)

Without `OPENROUTER_API_KEY` the API still runs and returns a sample text story (no illustrations).

## OpenRouter

Get a key at [https://openrouter.ai/](https://openrouter.ai/). Defaults in `.env`:

- Chat / vision: `google/gemini-2.5-flash`
- Images: `black-forest-labs/flux.2-schnell`

## API

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/auth/login` | |
| GET | `/api/books` | |
| GET | `/api/books/:slug` | |
| POST | `/api/personalizations` | multipart `photo` |
| GET | `/api/personalizations/:id` | poll status |
| POST | `/api/orders` | |
| GET | `/api/orders` | JWT |
| PATCH | `/api/orders/:id` | JWT |

## Notes

- TypeORM `synchronize: true` is for MVP only — switch to migrations before production.
- Uploads are stored in `api/uploads/` and served at `/uploads/`.
- Payme/Click and print-ready PDF are out of scope for this MVP.
