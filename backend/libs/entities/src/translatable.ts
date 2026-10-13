/**
 * Text stored in every active language, keyed by language code:
 * `{ "uz": "Ajdaho", "ru": "Дракон", "en": "Dragon" }`.
 * Languages are dynamic (see `languages` table), so this is a jsonb map
 * rather than one column per language.
 */
export type Translatable = Record<string, string>;
