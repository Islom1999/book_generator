# Loyiha arhitekturasi shabloni — Backend (NestJS) + Admin Panel (Angular/Fuse)

> Bu fayl **portativ shablon**: yangi loyiha boshlaganda shu faylni copy qilib tashlang va
> quyidagi qoidalar bo‘yicha fayl strukturasi + abstract classlarni qayta yarating.
> Manba: `asroortv_anime_api` (backend) + `banana_fuse_admin` (admin panel) — real ishlayotgan
> kod asosida chiqarilgan qonuniyat, nazariy emas.

---

## 1. Asosiy g‘oya

- **Bitta narsa — bitta joyda.** CRUD, pagination, soft-delete, filter logikasi har bir modulda
  qayta yozilmaydi — bitta abstract class’da yoziladi, modullar undan **extends** qiladi.
- **Shared lib — faqat 2+ app ishlatadigan narsa uchun.** Agar kod faqat bitta appda
  ishlatilsa, u `libs/` ga chiqmaydi, app ichida qoladi.
- **Admin oqimi ≠ Client oqimi.** Ikkisi uchun alohida base class bor, chunki ularning
  pagination/filter/response shakli boshqacha (pastda ko‘rsatilgan).

---

## 2. Monorepo fayl strukturasi (backend)

```
project-api/
├── apps/                        # har biri alohida ishga tushadigan process
│   ├── api/src/
│   │   ├── core/base/           # ← ABSTRACT CLASSLAR shu yerda (pastga qarang)
│   │   ├── common/              # guard, interceptor, decorator, util — appga xos
│   │   ├── auth/
│   │   └── modules/
│   │       ├── admin/<entity>/  # <entity>.controller.ts, .service.ts, .module.ts, dto/
│   │       └── client/<entity>/
│   ├── cron/src/                # scheduled jobs — alohida process, alohida pm2 entry
│   ├── bot/src/                 # telegram bot — alohida process
│   └── <boshqa worker>/src/
├── libs/                        # 2+ app baham ko‘radigan kod — @app/* alias bilan import
│   ├── entities/src/            # TypeORM entity’lar — HAMMA appga umumiy
│   ├── database/src/            # DB module + backup/maintenance servis
│   └── <boshqa-shared-domain>/src/
├── nest-cli.json                 # monorepo:true, projects{} — har bir app/lib shu yerda ro‘yxat
└── tsconfig.json                  # paths: "@app/entities": ["libs/entities/src"] va h.k.
```

**Qoida:** yangi `apps/*` yoki `libs/*` qo‘shilganda, albatta `nest-cli.json.projects` va
`tsconfig.json.paths` ikkisiga ham qo‘shiladi — aks holda build/alias ishlamaydi.

### Shared lib’ga nima tushadi (performance/qonuniyat)

| Kirish mezoni | Misol |
|---|---|
| 2 yoki undan ko‘p `apps/*` shu kodni ishlatadi | `entities` (api + cron + bot hammasi DB entity ishlatadi) |
| DB connection/migration/backup — bitta joyda boshqarilishi kerak | `database` libi — `@Cron` bilan backup, pruning, mirror |
| Tashqi integratsiya (bot token, notify) — bir nechta joydan chaqiriladi | `telegram-notify` |
| **Tushmaydi:** faqat bitta modulga xos business logika | `modules/admin/ai-dubbing/*` — API ichida qoladi |

Performance nuqtai nazaridan: shared lib — **stateless, engil** bo‘lishi kerak (faqat
Repository/HTTP client/util funksiyalar), og‘ir business logika yoki appga xos state
(masalan websocket connection pool) lib ichiga chiqarilmaydi, chunki uni har bir app
alohida instansiyalaydi.

---

## 3. Backend — abstract classlar (`apps/api/src/core/base/`)

```
core/base/
├── base.entity.ts              # CostumBaseEntity — hamma entity’ning otasi
├── bace.interface.ts           # PaginatedResult<T>, PrimeTableQuerySwaggerDTO, TableFilterRule
├── base_class/
│   ├── base.service.ts         # BaseAdminService<M, CreateDTO, UpdateDTO>
│   └── base.controller.ts      # BaseAdminController<M, CreateDTO, UpdateDTO>
└── base_class_client/
    ├── base.service.ts         # BaseClientService<M>
    └── base.controller.ts      # BaseClientController<M>
```

### 3.1 `CostumBaseEntity` — har bir entity shundan extends qiladi

```ts
export abstract class CostumBaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string
  @CreateDateColumn() created_at: Date
  @UpdateDateColumn() updated_at: Date
  @Index() @DeleteDateColumn({ nullable: true }) deleted_at?: Date // soft delete
}
```

### 3.2 `BaseAdminService<M, D, U>` — admin panel uchun CRUD

Beradigan funksiyalar: `create`, `findAll`, `findAllPaginationPost` (PrimeNG
filter/sort/pagination formatini qabul qiladi — `matchMode`: contains/equals/startsWith/…),
`findOne` (active/archive ikki holat), `update`, `delete` (soft), `repair` (restore).

```ts
export abstract class BaseAdminService<M extends CostumBaseEntity, D, U> {
  protected constructor(protected repository: Repository<M>) {}
  // create / findAll / findAllPaginationPost / findOne / update / delete / repair
}
```

### 3.3 `BaseAdminController<M, D, U>` — admin REST endpointlari

`dtoClassCreate()` va `dtoClassUpdate()` — ikki **abstract method**, har bir controller
o‘z DTO classini qaytaradi → shu orqali `class-validator` bilan avtomatik validatsiya
bo‘ladi (controller darajasida, har safar qayta yozilmaydi).

Standart endpointlar (har bir admin modulda bir xil yo‘l bilan ishlaydi):
`POST /`, `GET /`, `POST /pagination`, `POST /pagination/archive`, `GET /:id`,
`GET /archive/:id`, `PUT /:id`, `DELETE /:id`, `GET /repair/:id`.

### 3.4 Client tomoni — `BaseClientService<M>` / `BaseClientController<M>`

Admin’dan farqi: soft-delete/archive yo‘q, oddiyroq `findAllPagination` (ILIKE qidiruv,
`page`/`limit` query), `applyNestedJoins` — nested relation’larni avtomatik join qiladi.

### 3.5 Yangi modul qanday yoziladi (backend checklist)

1. `libs/entities/src/<name>.ts` — entity, `CostumBaseEntity`’dan extends.
2. `apps/api/src/modules/admin/<name>/<name>.service.ts`
   → `class XService extends BaseAdminService<XEntity, CreateDto, UpdateDto>`,
   constructor’da `super(repo)` chaqiriladi.
3. `apps/api/src/modules/admin/<name>/<name>.controller.ts`
   → `class XController extends BaseAdminController<XEntity, CreateDto, UpdateDto>`,
   `dtoClassCreate/dtoClassUpdate` override qilinadi.
4. Qo‘shimcha biznes metod kerak bo‘lsa (masalan `createAs(actorId, dto)` — permission bilan),
   servisga **override** qilinadi, bazaviy CRUD’ga tegilmaydi.
5. Client tomoni kerak bo‘lsa — xuddi shu tartibda, lekin `BaseClientService/Controller`.

---

## 4. Admin panel (Angular + Fuse + PrimeNG) — abstract classlar

```
src/app/
├── core/services/
│   ├── base.service.ts         # BaseApiService — http get/post/put/patch/delete wrapper
│   └── base.model.ts           # IPagination<T>, IBaseModel (backenddagi CostumBaseEntity’ga mos)
└── shared/
    ├── services/base-crud.service.ts   # BaseCrudService<T> — dynamic endpoint bilan CRUD
    └── abstracts/
        ├── base-table.component.ts     # BaseTableComponent<T> — grid/table sahifa skeletoni
        └── base-form.component.ts      # BaseFormComponent<T> — create/edit dialog skeletoni
```

### 4.1 `BaseApiService` — HTTP qatlami

Bitta joyda `apiBaseUrl` + headers/params logikasi. Hech bir servis to‘g‘ridan-to‘g‘ri
`HttpClient` chaqirmaydi — hammasi shu orqali.

### 4.2 `BaseCrudService<T>` — har bir entity uchun servis

```ts
@Injectable({ providedIn: 'root' })
export abstract class BaseCrudService<T> {
  public baseApi = inject(BaseApiService)
  constructor(public endpoint: string) {}
  // getAll / getAllPagination / getById / create / update / delete / repair
  // selectOptions / selectOptionsFromPagination — formly select uchun tayyor mapping
}
```

Yangi entity uchun servis — shunchaki:

```ts
@Injectable({ providedIn: 'root' })
export class XService extends BaseCrudService<X> {
  constructor() { super('admin/x') } // ← faqat endpoint beriladi
}
```

### 4.3 `BaseTableComponent<T>` — ro‘yxat sahifasi

Abstract qism: `gridService`, `columns`, `filterConfig`, `formComponent`,
`getItemId/getEditHeaderKey/getCreateHeaderKey`. Qolgani (filter, dialog ochish/yopish,
reload) bazada tayyor.

### 4.4 `BaseFormComponent<T>` — create/edit dialog

Abstract qism: `initFormFields`, `getById/create/update/delete/repair` (odatda shunchaki
servisga delegatsiya), `mapToModel` (forma → API body), `getDeleteTitle/Message`.
Submit/delete/repair/loading/confirmation — bazada tayyor, har safar qayta yozilmaydi.

### 4.5 Yangi modul qanday yoziladi (frontend checklist)

1. `modules/admin/<name>/<name>.service.ts` → `extends BaseCrudService<X>`, `super('admin/x')`.
2. `modules/admin/<name>/<name>-table.component.ts` → `extends BaseTableComponent<X>`.
3. `modules/admin/<name>/<name>-form.component.ts` → `extends BaseFormComponent<X>`.
4. Routing — `modules/admin/index.ts` ga yo‘l qo‘shiladi, `permission.catalog.ts` ga
   kerak bo‘lsa yangi ruxsat kalit so‘zi qo‘shiladi (`core/permission/`).
5. Grid column’lar — `shared/components/grid/common/column.model.ts` formatida beriladi,
   formly field’lar — `shared/ngx-formly/*` dagi tayyor type’lardan foydalaniladi
   (`type-select`, `type-input-mask`, `type-image-upload` va h.k.) — yangi input type
   yozishdan oldin shu papkani tekshirish kerak.

---

## 5. Yangi loyihani shu stildan boshlash — qadamlar

1. Backend: `nest new` → monorepo rejimga o‘tkazish (`nest g app api`, keyin
   `nest g library entities`, `nest g library database`), `core/base/` papkasini shu
   fayldagi 4 classni (`CostumBaseEntity`, `BaseAdminService/Controller`,
   `BaseClientService/Controller`) ko‘chirib qo‘yish.
2. Admin panel: Fuse (yoki boshlang‘ich Angular) shabloniga `core/services/base.*` va
   `shared/abstracts/*`, `shared/services/base-crud.service.ts` ni ko‘chirish.
3. Har bir yangi entity — backendda 1 ta entity + 1 service + 1 controller (hammasi
   bazadan extends), frontendda 1 service + 1 table + 1 form component. Boshqa narsa
   yozilmaydi — agar ko‘proq kod yozilayotgan bo‘lsa, demak bazaviy class’ga yetarli
   funksiya qo‘shilmagan, shuni to‘ldirish kerak, modulga qo‘shib yurilmaydi.
4. "Performance qonuniyati": shared lib — faqat 2+ joy ishlatadigan, stateless kod;
   og‘ir/statega bog‘liq narsa har doim app ichida qoladi (bo‘lim 2 jadvaliga qarang).
