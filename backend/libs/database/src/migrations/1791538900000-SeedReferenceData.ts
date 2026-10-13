import type { MigrationInterface, QueryRunner } from 'typeorm';

const LANGUAGES = [
  ['uz', 'Uzbek', 'Oʻzbekcha', true, 0],
  ['ru', 'Russian', 'Русский', false, 1],
  ['en', 'English', 'English', false, 2],
] as const;

const REGIONS: [string, string, string, string][] = [
  ['tashkent-city', 'Toshkent shahri', 'город Ташкент', 'Tashkent City'],
  ['tashkent', 'Toshkent viloyati', 'Ташкентская область', 'Tashkent Region'],
  ['andijan', 'Andijon viloyati', 'Андижанская область', 'Andijan Region'],
  ['bukhara', 'Buxoro viloyati', 'Бухарская область', 'Bukhara Region'],
  ['fergana', 'Fargʻona viloyati', 'Ферганская область', 'Fergana Region'],
  ['jizzakh', 'Jizzax viloyati', 'Джизакская область', 'Jizzakh Region'],
  ['khorezm', 'Xorazm viloyati', 'Хорезмская область', 'Khorezm Region'],
  ['namangan', 'Namangan viloyati', 'Наманганская область', 'Namangan Region'],
  ['navoi', 'Navoiy viloyati', 'Навоийская область', 'Navoi Region'],
  [
    'kashkadarya',
    'Qashqadaryo viloyati',
    'Кашкадарьинская область',
    'Kashkadarya Region',
  ],
  [
    'samarkand',
    'Samarqand viloyati',
    'Самаркандская область',
    'Samarkand Region',
  ],
  ['syrdarya', 'Sirdaryo viloyati', 'Сырдарьинская область', 'Syrdarya Region'],
  [
    'surkhandarya',
    'Surxondaryo viloyati',
    'Сурхандарьинская область',
    'Surkhandarya Region',
  ],
  [
    'karakalpakstan',
    'Qoraqalpogʻiston Respublikasi',
    'Республика Каракалпакстан',
    'Republic of Karakalpakstan',
  ],
];

const SETTINGS: [string, unknown, string][] = [
  ['trial.max_books', 3, 'Free trial: how many books a user can preview'],
  ['trial.max_pages', 3, 'Free trial: AI-generated pages per previewed book'],
  [
    'ai.daily_budget_usd',
    50,
    'Stop new trial generations once AI spend today reaches this',
  ],
  [
    'photos.retention_days',
    30,
    'Delete uploaded child photos this many days after delivery',
  ],
];

/** Initial reference data. Admins edit it afterwards in the admin panel. */
export class SeedReferenceData1791538900000 implements MigrationInterface {
  name = 'SeedReferenceData1791538900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const [code, name, nativeName, isDefault, sort] of LANGUAGES) {
      await queryRunner.query(
        `INSERT INTO "languages" ("code", "name", "native_name", "is_default", "sort_order")
         VALUES ($1, $2, $3, $4, $5)`,
        [code, name, nativeName, isDefault, sort],
      );
    }
    for (const [index, [code, uz, ru, en]] of REGIONS.entries()) {
      await queryRunner.query(
        `INSERT INTO "regions" ("code", "name", "sort_order") VALUES ($1, $2, $3)`,
        [code, JSON.stringify({ uz, ru, en }), index],
      );
    }
    for (const [key, value, description] of SETTINGS) {
      await queryRunner.query(
        `INSERT INTO "settings" ("key", "value", "description") VALUES ($1, $2, $3)`,
        [key, JSON.stringify(value), description],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "settings" WHERE "key" = ANY($1)`, [
      SETTINGS.map(([key]) => key),
    ]);
    await queryRunner.query(`DELETE FROM "regions" WHERE "code" = ANY($1)`, [
      REGIONS.map(([code]) => code),
    ]);
    await queryRunner.query(`DELETE FROM "languages" WHERE "code" = ANY($1)`, [
      LANGUAGES.map(([code]) => code),
    ]);
  }
}
