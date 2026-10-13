---
name: i18n
description: Add or change UI translations (admin/client i18n JSON) and translatable content fields; add a new content language. Use whenever user-visible text is added.
---

# Translations

Two kinds of text:

1. **UI strings** — static labels. Admin: `admin/src/assets/i18n/{uz,ru,en}.json`
   (Transloco). Keys: `nav.*` for menu, `admin.<feature>.*` for pages,
   `admin.common.*` shared, `form.validation.*`. Every key goes into **all three**
   files in the same change. Uzbek uses Latin script and the apostrophe `'`
   (o', g'). The flattened key sets of the three files must be identical:
   ```bash
   cd admin/src/assets/i18n && python3 -c "
   import json
   def keys(d,p=''):
       return {k2 for k,v in d.items() for k2 in (keys(v,p+k+'.') if isinstance(v,dict) else {p+k})}
   s={l:keys(json.load(open(l+'.json'))) for l in ('uz','ru','en')}
   [print(a,'missing',sorted(s['uz']^s[a])) for a in ('ru','en') if s['uz']!=s[a]]"
   ```
2. **Content** — data entered by admins (template titles, page text, region names).
   Stored as jsonb `Translatable` `{ "uz": "...", "ru": "...", "en": "..." }`.
   Backend validates with `@IsTranslatable()`; admin forms use `translatableFields()`;
   display with `pickTranslation()` / `translatable` pipe (falls back to the default
   language). Only the default language is required.

## Adding a content language

Insert a row in `languages` from the admin panel (Reference → Languages). No
migration or code change is needed for content. A new **UI** language additionally
needs `<code>.json`, a flag in `admin/src/assets/images/flags/`, the `flagCodes`
map in `layout/common/languages`, and `availableLangs` in `app.config.ts`.

## Rules

- Never hard-code a language list in logic; read `languages` (API `GET /api/languages`).
- Book text variables (`{name}`, `{name_possessive}`, …) are defined in
  `docs/BUSINESS_LOGIC.md` §4.2; don't invent new ones without updating the doc.
