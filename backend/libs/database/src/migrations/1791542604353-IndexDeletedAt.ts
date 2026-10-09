import { MigrationInterface, QueryRunner } from 'typeorm';

export class IndexDeletedAt1791542604353 implements MigrationInterface {
  name = 'IndexDeletedAt1791542604353';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_63494f35463086927937c977ba" ON "admin_users"  ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_82d69495c6c1a1417b671e428c" ON "regions"  ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cb25c60ed8257632c9b9e2b2d7" ON "post_offices"  ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b206ecf9aa35841cd948c25cfe" ON "districts"  ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e9ffc829ede5f378827cc9f16a" ON "languages"  ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ebebfa479dbc6c92bfc07cbd54" ON "settings"  ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_01244fea5e6ccbce461ab0344f" ON "user_identities"  ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_073999dfec9d14522f0cf58cd6" ON "users"  ("deleted_at") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_073999dfec9d14522f0cf58cd6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_01244fea5e6ccbce461ab0344f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ebebfa479dbc6c92bfc07cbd54"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e9ffc829ede5f378827cc9f16a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b206ecf9aa35841cd948c25cfe"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cb25c60ed8257632c9b9e2b2d7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_82d69495c6c1a1417b671e428c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_63494f35463086927937c977ba"`,
    );
  }
}
