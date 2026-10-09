# Backend (NestJS 12 monorepo)

## Structure

- `apps/api` — REST API. Feature folders: `admin-auth`, `auth`, `reference`,
  `admin-users`, `users`. Global: helmet, CORS, `ValidationPipe`
  (`whitelist` + `forbidNonWhitelisted` + `transform`), throttler 120/min.
- `apps/worker` — BullMQ consumers (generation, print, notifications).
- `apps/bot` — grammY Telegram bot; disabled when `TELEGRAM_BOT_TOKEN` is empty.
- `libs/database` (`@app/database`) — entities, migrations, `DatabaseModule`,
  CLI `data-source.ts`. Register every new entity in `entities/index.ts` (`ENTITIES`).
- `libs/common` (`@app/common`) — `BaseCrudService`, `CrudController()`,
  `TableQueryDto`, `@IsTranslatable()`, auth guards/decorators, queue names.

## ESM / TypeScript gotchas

- `"type": "module"`, `nodenext`: relative imports need the `.js` suffix
  (`import { X } from './x.js'`). Library imports use `@app/common` / `@app/database`.
- Relation properties must be typed `Relation<T>` (from `typeorm`), otherwise
  circular entity imports crash with "Cannot access 'X' before initialization".
- TypeORM 1.x: `relations` is an object (`{ region: true }`), not a string array.
- Abstract classes that use DI (guards, services) still need `@Injectable()`.
- Classes returned from mixin factories can't have `protected` members
  (TS4094) — that's why controllers use `constructor(readonly service: …)`.
- Entity columns are `snake_case` (Fuse `IBaseModel` contract). Extend
  `BaseEntity` (uuid `id`, `version_id`, `created_at`, `updated_at`, `deleted_at`).

## Admin CRUD contract

`CrudController<T>({ create, update })` gives the routes the Fuse admin's
`BaseCrudService` calls: `GET /`, `POST /pagination`, `POST /pagination/archive`,
`GET /archive/:id`, `GET /repair/:id`, `GET/PUT/DELETE /:id`, `POST /`.
Pagination body `{ first, rows, sortField, sortOrder, filters, globalFilter }`
→ `{ count, data }`. Filters and sort are whitelisted against entity columns.
Delete is soft. See the `backend-crud` skill for the full recipe.

## Domain code

Business rules (wallet, orders, trial, moderation) belong in dedicated
services, not in controllers or generic CRUD overrides. Use the
`business-rules` skill when touching money, order status, trial limits or
moderation.

## Checks

`npm run typecheck && npm run lint && npm test && npm run build`.
After entity changes: `npm run migration:generate --name=Xxx`, review the SQL,
then `npm run migration:run`; a second `migration:generate` must report no changes.
Unit tests: vitest, `*.spec.ts` next to the code.
