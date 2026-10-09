# Admin panel (Fuse, Angular 20)

Built from the owner's `fuse-schematics` starter and the owner's template
(`docs/ARCHITECTURE_TEMPLATE.md` §4). Stay inside its patterns; don't introduce
a different UI kit or state library.

## Key places

- `src/app/app.routes.ts` — auth/layout shell; admin pages live in
  `src/app/modules/admin/index.ts` (`adminRoutes`).
- `src/app/core/navigation/navigation.ts` — `adminNavigation`; titles are
  Transloco keys (`nav.*`), translated by `NavigationService`.
- `src/app/core/auth/` — sign-in against `admin/auth/sign-in`; user has `role`.
- `src/app/core/languages/content-languages.service.ts` — active content
  languages from the API (signal), loaded in `app.resolvers.ts`.
- `src/app/shared/translatable/translatable.ts` — `Translatable`,
  `pickTranslation`, `translatable` pipe, `translatableFields()` for Formly.
- `src/app/core/services/base.service.ts` — `BaseApiService`; nothing calls
  `HttpClient` directly.
- `src/app/shared/services/base-crud.service.ts` — `BaseCrudService<T>`
  (CRUD + `selectOptions` / `selectOptionsFromPagination` for Formly selects),
  `shared/abstracts` (`BaseTableComponent`, `BaseFormComponent`),
  `shared/ngx-formly/*` (ready Formly types — check before writing a new one),
  `shared/components/grid`, `table-filter`.
- `src/assets/i18n/{uz,ru,en}.json` — UI strings. Every key must exist in all three.
- Feature modules: `src/app/modules/admin/<group>/<feature>/`
  (`common/{models,services}`, `pages/<feature>-list`, `pages/<feature>-form`,
  `<feature>.routes.ts`). Reference implementation: `reference/region`.

## Rules

- Generate features with `npx ng g fuse-schematics:feature <name> --path=src/app/modules/admin/<group>`,
  then adapt (see the `admin-crud-page` skill). The package was installed with
  `--legacy-peer-deps` (it declares Angular 19).
- Models mirror the API exactly (`snake_case`, extend `IBaseModel`).
- Content text fields use `translatableFields()`; never hard-code uz/ru/en.
- All labels/headers are i18n keys with `translate: true`.
- Grid templates: `'translate'` for `Translatable`, `'boolean'` for flags,
  dot paths (`region.name`) work for relations.
- Hide menu items/actions the admin's permissions don't allow; the API enforces them anyway.
- Follow the `ui-ux` skill; run its `responsive-check.mjs` on changed pages.
- `environment.development.ts` points to `http://localhost:3000/api`.

## Checks

`npx ng build` must pass. For UI changes, run the app and click through
(the `e2e-tester` agent can do it with Playwright).
Known harmless dev warning: NG0100 in `FuseLoadingBarComponent`.
