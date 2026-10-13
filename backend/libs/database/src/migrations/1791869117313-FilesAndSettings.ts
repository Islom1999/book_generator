import type { MigrationInterface, QueryRunner } from 'typeorm';

/** Settings added with this release (BUSINESS_LOGIC §15); existing rows are kept. */
const SETTINGS: [string, unknown, string][] = [
  ['trial.max_regenerations', 1, 'Free trial: regenerations allowed per page'],
  [
    'trial.expires_days',
    30,
    'Free trial previews are removed after this many days',
  ],
  ['children.max_per_user', 5, 'How many child profiles one customer can have'],
  [
    'order.customer_review_enabled',
    true,
    'Customer approves pages before printing',
  ],
  [
    'order.customer_review_hours',
    48,
    'Auto-approve after this many hours of customer silence',
  ],
  [
    'order.max_customer_revisions',
    1,
    'Revision requests a customer can make per order',
  ],
  [
    'moderation.max_regenerations_per_page',
    3,
    'Moderator regenerations per page',
  ],
  ['preview.max_px', 800, 'Longest side of customer previews, px'],
  [
    'preview.watermark_text',
    'ertaklar.uz',
    'Text tiled over customer previews',
  ],
  ['preview.url_ttl_seconds', 900, 'Lifetime of signed image URLs, seconds'],
];

export class FilesAndSettings1791869117313 implements MigrationInterface {
  name = 'FilesAndSettings1791869117313';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version_id" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "key" character varying(512) NOT NULL, "preview_key" character varying(512), "kind" character varying(32) NOT NULL, "mime_type" character varying(64) NOT NULL, "size_bytes" integer NOT NULL, "width" integer, "height" integer, "user_id" uuid, "delete_after" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_61d3fd623ab1f6144c9a7a750f" ON "files"  ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a5c218dfdf6ad6092fed2230a8" ON "files"  ("key") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a7435dbb7583938d5e7d137604" ON "files"  ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_56a369e1840fd28887dfa7728e" ON "files"  ("delete_after") `,
    );
    for (const [key, value, description] of SETTINGS) {
      await queryRunner.query(
        `INSERT INTO "settings" ("key", "value", "description")
                 SELECT $1::varchar, $2::jsonb, $3::text WHERE NOT EXISTS (SELECT 1 FROM "settings" WHERE "key" = $1::varchar)`,
        [key, JSON.stringify(value), description],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "settings" WHERE "key" = ANY($1)`, [
      SETTINGS.map(([key]) => key),
    ]);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_56a369e1840fd28887dfa7728e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a7435dbb7583938d5e7d137604"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a5c218dfdf6ad6092fed2230a8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_61d3fd623ab1f6144c9a7a750f"`,
    );
    await queryRunner.query(`DROP TABLE "files"`);
  }
}
