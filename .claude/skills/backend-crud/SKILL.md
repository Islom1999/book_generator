---
name: backend-crud
description: Add a new entity with an admin CRUD API (BaseAdminService/BaseAdminController) and, if needed, a storefront endpoint (BaseClientService/BaseClientController), following the owner's architecture template. Use for any new admin-managed resource (book formats, templates, promo codes, etc.).
---

# Backend CRUD resource

Rules come from `docs/ARCHITECTURE_TEMPLATE.md` §3. Reference implementations:
`backend/apps/api/src/modules/admin/regions/` (simple), `.../districts/` (relation),
`.../languages/` (business override), `modules/client/districts/` (storefront filter).

Per resource you write: 1 entity + 1 service + 1 controller (+ DTOs, module).
If you find yourself writing more CRUD code than that, the base class is missing
a feature — extend the base instead of patching the module.

## Steps

1. **Entity** — `backend/libs/entities/src/<name>.entity.ts`
   - `@Entity('<plural_snake>')`, `extends CostumBaseEntity` (`./base.entity.js`).
   - Columns `snake_case`, explicit `type` on every `@Column`.
   - Translatable text: `@Column({ type: 'jsonb' }) name: Translatable;`
   - Money: `@Column({ type: 'bigint' })` in tiyin (see `business-rules`).
   - Relations: `@ManyToOne(() => Region, { onDelete: 'RESTRICT' }) @JoinColumn({ name: 'region_id' }) region: Relation<Region>;`
     plus `@Column({ type: 'uuid' }) region_id: string;`
   - Unique ignoring archived rows: `@Index({ unique: true, where: '"deleted_at" IS NULL' })`.
   - Export from `libs/entities/src/index.ts` **and** add to `ENTITIES`.
2. **Migration** — `db-migration` skill.
3. **DTOs** — `modules/admin/<plural>/dto/create-<singular>.dto.ts` with
   `class-validator` on every field (`@IsTranslatable()` from `common/`, `@IsUUID()`
   for FKs, `@IsOptional()`), and `update-<singular>.dto.ts`:
   `extends PartialType(CreateXDto)` (`@nestjs/swagger`). Unknown fields are rejected,
   so the DTO must list every field the admin form sends.
4. **Service** — `modules/admin/<plural>/<plural>.service.ts`:
   ```ts
   @Injectable()
   export class XsService extends BaseAdminService<X, CreateXDto, UpdateXDto> {
     constructor(@InjectRepository(X) repository: Repository<X>) {
       super(repository, { searchFields: [...], relations: ['region', 'region.country'], defaultSort: { field, order } });
     }
   }
   ```
   Business invariants: override `create`/`update`/`delete` and call `super`.
5. **Controller** — `<plural>.controller.ts`:
   ```ts
   @ApiTags('admin / <plural>')
   @ApiBearerAuth()
   @Controller('admin/<plural-kebab>')
   @AdminAuth(AdminRole.OPERATOR) // permission: addresses.manage
   export class XsController extends BaseAdminController<X, CreateXDto, UpdateXDto> {
     constructor(service: XsService) { super(service); }
     protected dtoClassCreate() { return CreateXDto; }
     protected dtoClassUpdate() { return UpdateXDto; }
   }
   ```
   Pick the permission key from BUSINESS_LOGIC §9 (add a key there if none fits).
   If some base routes must not exist (no create/delete), write explicit routes
   without extending the base (see `modules/admin/customers`).
6. **Module** — `<plural>.module.ts` (`TypeOrmModule.forFeature([X])`, controller,
   service; export the service only if another module needs it) and add it to
   `modules/admin/admin.module.ts`.
7. **Storefront** (only if the client site needs it) — `modules/client/<plural>/`:
   `ClientXsService extends BaseClientService<X>` with `where: { is_active: true }`,
   `filterFields` for parent ids, `searchFields`; `ClientXsController extends
   BaseClientController<X>` with `@Controller('<plural-kebab>')`; register in
   `modules/client/client.module.ts`. Never expose internal columns — if the entity has
   any, override `query()` to `select` only public fields.
8. **Verify** — `npm run typecheck && npm run lint && npm test && npm run build`, start
   the API and curl: sign in (`POST /api/admin/auth/sign-in`), `POST /api/admin/<x>/pagination`
   `{"first":0,"rows":10}`, create (and an extra unknown field → 400), update, delete →
   `GET archive/:id` → `GET repair/:id`, missing permission → 403, no token → 401;
   storefront `GET /api/<x>?page=1&limit=20` and a bad filter → 400.
9. Add the admin page (`admin-crud-page` skill), update `docs/ARCHITECTURE.md` §6 (✅)
   and `docs/ROADMAP.md`.
