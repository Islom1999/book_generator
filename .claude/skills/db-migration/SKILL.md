---
name: db-migration
description: Create, review, run or revert TypeORM migrations in backend/libs/database, including seed/reference-data migrations. Use whenever an entity changes or data must be seeded.
---

# Database migrations

`synchronize` is off; the schema changes only through migrations in
`backend/libs/database/src/migrations/`. Commands run from `backend/` and read `backend/.env`.

## Schema change

1. Edit/add the entity in `libs/entities/src/` (and register it in `libs/entities/src/index.ts` → `ENTITIES`).
2. Make sure the DB is up and current: `docker compose up -d` (repo root), `npm run migration:run`.
3. `npm run migration:generate --name=AddBookTemplates` (PascalCase, describes the change).
4. **Read the generated SQL.** Check: no unexpected `DROP`, column renames are not
   drop+add (rewrite by hand as `RENAME COLUMN` to keep data), NOT NULL columns on
   existing tables have a default or a backfill step, `down()` exactly reverses `up()`.
5. `npm run migration:run`, then `npm run migration:generate --name=Check` must say
   "No changes in database schema were found".
6. `npm run migration:revert` then `migration:run` again to prove `down()` works.

## Seed / reference data

`npm run migration:create --name=SeedXxx`, write idempotent-ish SQL with
`queryRunner.query()` (see `1791538900000-SeedReferenceData.ts`): fixed values only,
no secrets, `down()` deletes exactly what `up()` inserted. New `settings` keys must
also be listed in `docs/BUSINESS_LOGIC.md` §15.

## Rules

- Never edit a migration that is already pushed/applied anywhere; add a new one.
- Never enable `synchronize`, never run raw DDL outside migrations.
- Money columns `bigint` (tiyin); timestamps `timestamptz`; jsonb for Translatable.
- The local DB is `ertaklar_app` (port per `.env`). The legacy DB `ertaklar` uses
  `synchronize: true` — never point the new backend at it.
