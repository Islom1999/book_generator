import { ValidateBy, type ValidationOptions } from 'class-validator';

/**
 * Validates a `Translatable` map: `{ "uz": "...", "ru": "..." }` with
 * language-code keys and non-empty string values. Which languages are
 * required is a business rule checked against the `languages` table.
 */
export function IsTranslatable(options?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isTranslatable',
      validator: {
        validate: (value: unknown) =>
          typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value) &&
          Object.keys(value).length > 0 &&
          Object.entries(value).every(
            ([code, text]) =>
              /^[a-z]{2}(-[a-z0-9]{2,4})?$/i.test(code) &&
              typeof text === 'string' &&
              text.trim().length > 0,
          ),
        defaultMessage: () =>
          '$property must be an object like { "uz": "...", "ru": "..." }',
      },
    },
    options,
  );
}
