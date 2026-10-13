# Backend (NestJS 12 monorepo)

Structure follows the owner's template, `docs/ARCHITECTURE_TEMPLATE.md`
(deviations: `docs/ARCHITECTURE.md` §2).

## Structure

```
apps/api/src/
  core/base/
    base.interface.ts          PrimeTableQuerySwaggerDTO, PaginatedResult, ClientQuery…
    base.query.ts              shared query helpers (applyNestedJoins, applySearch…)
    base_class/                BaseAdminService<M,D,U>, BaseAdminController<M,D,U>
    base_class_client/         BaseClientService<M>, BaseClientController<M>
  common/                      guards, decorators, validators (API-only) — import from '../../../common/index.js'
  auth/admin, auth/client      sign-in flows
  modules/admin/<entity>/      <entity>.controller.ts .service.ts .module.ts dto/  → registered in modules/admin/admin.module.ts
  modules/client/<entity>/     storefront endpoints                                  → modules/client/client.module.ts
apps/worker                    BullMQ consumers
apps/bot                       grammY bot (disabled without TELEGRAM_BOT_TOKEN)
libs/entities   @app/entities  every TypeORM entity + CostumBaseEntity; add new ones to ENTITIES in index.ts
libs/database   @app/database  DatabaseModule, databaseOptions, migrations, CLI data-source
libs/queues     @app/queues    queue names + redis connection
```

**Shared-lib rule:** code goes into `libs/` only when 2+ apps use it and it's
stateless (entities, DB, queue names, external notifier). Everything used by
one app stays inside that app. A new app/lib must be added to both
`nest-cli.json` `projects` and `tsconfig.json` `paths`.

## Base classes — write less code

- Admin resource = entity + `XService extends BaseAdminService<X, CreateXDto, UpdateXDto>`
  + `XController extends BaseAdminController<…>` with `dtoClassCreate()` /
  `dtoClassUpdate()`. Routes, pagination, filters, archive, restore, body
  validation come from the base. Recipe: `backend-crud` skill.
- Storefront list/detail = `BaseClientService<X>` (options: `searchFields`,
  `relations` with dot paths, `filterFields`, `where: { is_active: true }`) +
  `BaseClientController<X>`.
- Extra business behaviour → override or add methods in the concrete service
  (e.g. `LanguagesService.keepSingleDefault`, `AdminUsersService.withHash`).
  Don't copy CRUD into modules; if every module needs something, extend the base.
- Resources that must not expose every base route (e.g. customers: no create/delete)
  write explicit routes instead (`modules/admin/customers`).

## ESM / TypeScript gotchas

- `"type": "module"`, `nodenext`: relative imports need the `.js` suffix.
- Relation properties must be typed `Relation<T>` (from `typeorm`), otherwise
  circular entity imports crash with "Cannot access 'X' before initialization".
- Every `@Column` gets an explicit `type`.
- Abstract classes that use DI still need `@Injectable()`.
- Entity columns are `snake_case` (Fuse `IBaseModel` contract); entities extend
  `CostumBaseEntity` (uuid `id`, `version_id`, `created_at`, `updated_at`, indexed `deleted_at`).
- `libs/database/src/data-source.ts` imports entities by relative path because
  the CLI build is plain `tsc` (no alias rewriting). Don't "fix" it to `@app/entities`.

## Domain code

Business rules (wallet, orders, trial, moderation) live in dedicated services
inside the owning module, with DB transactions. Use the `business-rules` skill
when touching money, order status, trial limits or moderation.

## Checks

`npm run typecheck && npm run lint && npm test && npm run build`.
After entity changes: `npm run migration:generate --name=Xxx`, review the SQL,
`npm run migration:run`; a second `migration:generate` must report no changes.
Unit tests: vitest, `*.spec.ts` next to the code.
