import type { MigrationInterface, QueryRunner } from 'typeorm';

/** Starting roles from BUSINESS_LOGIC §9; editable in the admin panel afterwards. */
const ROLES: [string, { uz: string; ru: string; en: string }, string[]][] = [
  [
    'moderator',
    { uz: 'Moderator', ru: 'Модератор', en: 'Moderator' },
    [
      'moderation.review',
      'moderation.regenerate',
      'moderation.edit_text',
      'orders.view',
      'customers.view',
      'dashboard.view',
    ],
  ],
  [
    'operator',
    { uz: 'Operator', ru: 'Оператор', en: 'Operator' },
    [
      'orders.view',
      'orders.cancel',
      'orders.hold',
      'customers.view',
      'customers.edit',
      'customers.block',
      'customers.grant_trial',
      'addresses.manage',
      'dashboard.view',
    ],
  ],
  [
    'logistics',
    { uz: 'Logistika', ru: 'Логистика', en: 'Logistics' },
    [
      'print.manage',
      'print.download',
      'shipping.manage',
      'orders.view',
      'addresses.manage',
    ],
  ],
  [
    'finance',
    { uz: 'Moliya', ru: 'Финансы', en: 'Finance' },
    [
      'wallet.view',
      'wallet.adjust',
      'wallet.withdraw',
      'payments.view',
      'reports.finance',
      'customers.view',
      'orders.cancel',
    ],
  ],
];

export class AdminRolesAndAudit1791868165324 implements MigrationInterface {
  name = 'AdminRolesAndAudit1791868165324';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admin_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version_id" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" jsonb NOT NULL, "description" text, "permissions" text array NOT NULL DEFAULT '{}', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_091baca34754e848b9f8c4e7be9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e8b16bfff05fda0e9443e44354" ON "admin_roles"  ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version_id" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "admin_id" uuid, "action" character varying(64) NOT NULL, "entity" character varying(64) NOT NULL, "entity_id" character varying(64), "before" jsonb, "after" jsonb, "ip" character varying(64), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e00999c68bafa48e81af2ff3e7" ON "audit_logs"  ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b29de603374cbfa7d776d88e5b" ON "audit_logs"  ("admin_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_82edbc5f8a1821ff01b8b9c865" ON "audit_logs"  ("entity", "entity_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_users" ADD "is_super_admin" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "admin_users" ADD "role_id" uuid`);
    // Move admins from the old enum to the seeded roles.
    await queryRunner.query(
      `UPDATE "admin_users" SET "is_super_admin" = true WHERE "role" = 'super_admin'`,
    );
    for (const [code, name, permissions] of ROLES) {
      const [{ id }] = await queryRunner.query(
        `INSERT INTO "admin_roles" ("name", "permissions") VALUES ($1, $2) RETURNING "id"`,
        [name, permissions],
      );
      await queryRunner.query(
        `UPDATE "admin_users" SET "role_id" = $1 WHERE "role" = $2`,
        [id, code],
      );
    }
    await queryRunner.query(`ALTER TABLE "admin_users" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."admin_users_role_enum"`);
    await queryRunner.query(
      `ALTER TABLE "admin_users" ADD CONSTRAINT "FK_4fd00bf1bafe85885a51d3da925" FOREIGN KEY ("role_id") REFERENCES "admin_roles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_b29de603374cbfa7d776d88e5b5" FOREIGN KEY ("admin_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_b29de603374cbfa7d776d88e5b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_users" DROP CONSTRAINT "FK_4fd00bf1bafe85885a51d3da925"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."admin_users_role_enum" AS ENUM('super_admin', 'moderator', 'operator', 'logistics', 'finance')`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_users" ADD "role" "public"."admin_users_role_enum" NOT NULL DEFAULT 'operator'`,
    );
    await queryRunner.query(
      `UPDATE "admin_users" SET "role" = 'super_admin' WHERE "is_super_admin"`,
    );
    await queryRunner.query(`ALTER TABLE "admin_users" DROP COLUMN "role_id"`);
    await queryRunner.query(
      `ALTER TABLE "admin_users" DROP COLUMN "is_super_admin"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_82edbc5f8a1821ff01b8b9c865"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b29de603374cbfa7d776d88e5b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e00999c68bafa48e81af2ff3e7"`,
    );
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e8b16bfff05fda0e9443e44354"`,
    );
    await queryRunner.query(`DROP TABLE "admin_roles"`);
  }
}
