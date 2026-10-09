---
name: backend-crud
description: Add a new database entity with an admin CRUD API (and optional public endpoint) in the NestJS backend, following the Fuse admin contract. Use when a new reference table or admin-managed resource is needed (book formats, templates, promo codes, etc.).
---

# Backend CRUD resource

Reference implementation: `backend/apps/api/src/reference/` + `backend/libs/database/src/entities/region.entity.ts`.

## Steps

1. **Entity** — `backend/libs/database/src/entities/<name>.entity.ts`
   - `@Entity('<plural_snake>')`, `extends BaseEntity` (from `./base.entity.js`).
   - Columns `snake_case`, explicit `type` on every `@Column`.
   - Translatable text: `@Column({ type: 'jsonb' }) name: Translatable;`
   - Money: `@Column({ type: 'bigint' })` in tiyin (see `business-rules` skill).
   - Relations: `@ManyToOne(() => Region, { onDelete: 'RESTRICT' }) @JoinColumn({ name: 'region_id' }) region: Relation<Region>;`
     plus an explicit `@Column({ type: 'uuid' }) region_id: string;`
   - Unique constraints that must ignore archived rows: `@Index({ unique: true, where: '"deleted_at" IS NULL' })`.
   - Export it from `entities/index.ts` **and** add it to `ENTITIES`.
2. **Migration** — follow the `db-migration` skill (`npm run migration:generate --name=AddXxx`).
3. **DTOs** — `Create<Name>Dto` with `class-validator` decorators for every field
   (`@IsTranslatable()` from `@app/common` for jsonb text, `@IsUUID()` for FKs,
   `@IsOptional()` for optional). `Update<Name>Dto extends PartialType(Create<Name>Dto)`
   with `PartialType` from `@nestjs/swagger`. Unknown fields are rejected globally
   (`forbidNonWhitelisted`), so the DTO must list every field the admin form sends.
4. **Service** — `@Injectable() class XService extends BaseCrudService<X>`:
   `super(repo, { searchFields: [...], relations: ['region'], defaultSort: { field, order } })`.
   Put invariants in `create`/`update` overrides (see `LanguagesService.keepSingleDefault`).
   Real business workflows (orders, wallet) do NOT go here — use a domain service.
5. **Admin controller** —
   ```ts
   @Controller('admin/<plural-kebab>')
   @AdminAuth(AdminRole.OPERATOR)          // permission: addresses.manage (BUSINESS_LOGIC §9)
   export class XAdminController extends CrudController<X>({ create: CreateXDto, update: UpdateXDto }) {
     constructor(readonly service: XService) { super(); }
   }
   ```
   Pick the permission key from the §9 catalogue (add a new key there if none fits).
   Read-only or restricted resources: write explicit routes instead (see `users/users.admin.ts`).
6. **Public endpoint** (only if the client site needs it) — separate controller without
   `/admin`, return only active, non-sensitive fields.
7. **Module** — `TypeOrmModule.forFeature([X])`, controllers, providers; import it in
   `apps/api/src/app.module.ts`. Relative imports end with `.js`.
8. **Verify** — `npm run typecheck && npm run lint && npm test`, start the API and
   smoke-test with curl: sign in (`POST /api/admin/auth/sign-in`), then
   `POST /api/admin/<x>/pagination` with `{"first":0,"rows":10}`, create, update,
   delete → archive → `GET repair/:id`. Check an admin without the permission gets 403.
9. Add the admin page with the `admin-crud-page` skill and update
   `docs/ARCHITECTURE.md` §6 (✅) and `docs/ROADMAP.md`.
