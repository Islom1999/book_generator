---
name: admin-crud-page
description: Add a list + form page to the Fuse admin panel for a backend CRUD resource, including routes, navigation, i18n and translatable fields. Use after the backend endpoint exists.
---

# Admin CRUD page (Fuse)

Reference: `admin/src/app/modules/admin/reference/region/` (simple) and
`reference/district/` (select options from another resource).

## Steps

1. Generate the skeleton from `admin/`:
   `npx ng g fuse-schematics:feature <name> --path=src/app/modules/admin/<group>`
2. **Model** `common/models/<name>.model.ts`: `interface IX extends IBaseModel`, fields
   exactly as the API returns them (`snake_case`, `Translatable` for jsonb text,
   nested relation objects as optional).
3. **Service** `common/services/<name>.service.ts`: `extends BaseCrudService<IX>`,
   `super('admin/<plural-kebab>')` — same path as the Nest controller.
4. **List** `pages/<name>-list`: `columns` (headers are i18n keys; `template: 'translate'`
   for Translatable, `'boolean'` for flags; dot paths like `region.name`),
   `filterConfig` fields keyed by real columns, `getCreateHeaderKey/getEditHeaderKey`.
   Set `showAddButton = false` for read-only resources.
5. **Form** `pages/<name>-form`: Formly `fields`.
   - Translatable: `translatableFields('name', 'admin.common.name', this.languages.languages(), this.transloco)`
     (inject `ContentLanguagesService`). Never hard-code languages.
   - Selects from another resource: an `XOptionsService` that loads `getAll()` and maps
     to `{ label: pickTranslation(name, lang), value: id }` (see district).
   - `mapToModel()` returns only fields the API DTO accepts (extra fields → 400).
   - `getDeleteMessage()` returns the record's display name.
6. **Route** in `src/app/app.routes.ts`:
   `{ path: '<kebab>', loadChildren: () => import('app/modules/admin/<group>/<name>/<name>.routes') }`.
7. **Navigation** in `src/app/core/navigation/navigation.ts`: `title: 'nav.<key>'`,
   heroicons icon, link matching the route.
8. **i18n** — add `nav.<key>` and `admin.<name>.{title,create,edit,fields.*}` to all of
   `src/assets/i18n/{uz,ru,en}.json` (use the `i18n` skill).
9. **Verify** — `npx ng build`; run API + `npm start -- --port 4300`, sign in, open the page,
   create/edit/delete/restore, switch language. Use the `e2e-tester` agent for a
   Playwright run if available.
