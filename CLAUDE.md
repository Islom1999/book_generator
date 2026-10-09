# Ertaklar.uz

Personalized printed storybooks for children in Uzbekistan: the child becomes
the hero, AI generates the pages, a moderator approves them, and the printed
book ships to a post office. Customers never get a PDF.

Talk to the owner in **Uzbek** (Latin script). Code, identifiers, commit
messages and these Claude files are in English. `docs/` are in Uzbek.

## Read before changing behaviour

- `docs/BUSINESS_LOGIC.md` — the source of truth for rules: trial limits,
  wallet/ledger, order states, moderation, roles, settings keys. If a change
  alters a rule, update this doc **in the same change**. If code and doc
  disagree, stop and ask; don't silently pick one.
- `docs/ARCHITECTURE.md` — decisions and conventions.
- `docs/ROADMAP.md` — tick items off when done.

## Layout

| Path | What |
| --- | --- |
| `backend/` | NestJS 12 monorepo (ESM): `apps/api`, `apps/worker`, `apps/bot`, `libs/common`, `libs/database`. See `backend/CLAUDE.md` |
| `admin/` | Fuse admin panel, Angular 20 + PrimeNG + Formly + Transloco. See `admin/CLAUDE.md` |
| `client/` | Customer site (not created yet): Angular SSR + Tailwind + PrimeNG |
| `legacy/` | Old MVP. **Read-only reference** (AI pipeline lives in `legacy/api/src/openrouter`, `replicate`, `personalizations`). Never edit or import from it |
| `docs/` | Business logic, architecture, roadmap |

## Commands

npm 10 crashes on this tree (`edgesOut` bug); use npm 11: `npx -y npm@11 install`.

```bash
docker compose up -d                      # postgres :55433 (db ertaklar_app), redis :6379
cd backend && npm run typecheck && npm run lint && npm test && npm run build
cd backend && npm run migration:run       # needs backend/.env (copy .env.example)
cd backend && npm run start:api           # :3000/api, swagger /api/docs
cd admin && npx ng build                  # admin build check
cd admin && npm start -- --port 4300
```

Use the `verify` skill before saying work is done.

## Non-negotiable rules

- Schema changes only via migrations (`synchronize` is off). Never edit a
  migration that has been pushed; add a new one.
- Money is integer **tiyin** (`bigint`), never floats. Balance = sum of
  `wallet_transactions`; rows are append-only, every row has an
  `idempotency_key`; debits lock the wallet row in a DB transaction.
- Order status changes go through one transition table and always write
  `order_status_history` + audit log. Never `UPDATE orders SET status` ad hoc.
- Values the owner hasn't decided (prices, formats, limits) live in
  `settings` or a reference table, never hard-coded.
- Translatable text is `jsonb` `{ uz, ru, en, ... }` (`Translatable`);
  languages are dynamic (`languages` table) — never hard-code the list.
- Customer-facing APIs never expose full-resolution images or print files.
- Admin endpoints live under `/api/admin/*` with `@AdminAuth(roles…)`;
  customer endpoints use `@UserAuth()`.
- Secrets only in `.env` (git-ignored). Don't print or commit them.

## Shell safety

An earlier session deleted the repo's `.git` because `cd x && ...; rm -rf .git`
ran in the wrong directory. Never chain destructive commands after `cd`; use
absolute paths for `rm`, `git`, and anything irreversible. Don't run
`pkill -f` patterns that can match your own shell.

## Git

Commit in small logical steps with clear messages. Don't open PRs unless asked.
