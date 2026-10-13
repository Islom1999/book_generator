import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1791538805773 implements MigrationInterface {
  name = 'Init1791538805773';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."admin_users_role_enum" AS ENUM('super_admin', 'moderator', 'operator', 'logistics', 'finance')`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version_id" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "email" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "full_name" character varying(255) NOT NULL, "role" "public"."admin_users_role_enum" NOT NULL DEFAULT 'operator', "is_active" boolean NOT NULL DEFAULT true, "last_login_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_06744d221bb6145dc61e5dc441d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_60edb560e55276b88b098f4bb6" ON "admin_users"  ("email") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "regions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version_id" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" jsonb NOT NULL, "code" character varying(32), "sort_order" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_4fcd12ed6a046276e2deb08801c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_offices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version_id" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "postal_code" character varying(10) NOT NULL, "name" jsonb NOT NULL, "address" jsonb, "district_id" uuid NOT NULL, "latitude" double precision, "longitude" double precision, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_462d593b5575336748ab6da4cc9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_bfd6a40a585e4f1cdc3a51acd8" ON "post_offices"  ("postal_code") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "districts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version_id" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" jsonb NOT NULL, "region_id" uuid NOT NULL, "sort_order" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_972a72ff4e3bea5c7f43a2b98af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "languages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version_id" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "code" character varying(8) NOT NULL, "name" character varying(64) NOT NULL, "native_name" character varying(64) NOT NULL, "is_default" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "sort_order" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2bd10c164897426ac070d03e2b" ON "languages"  ("code") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version_id" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "key" character varying(128) NOT NULL, "value" jsonb NOT NULL, "description" text, CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_369af14792a93be58c0a9f442b" ON "settings"  ("key") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_identities_provider_enum" AS ENUM('google', 'telegram')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_identities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version_id" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "provider" "public"."user_identities_provider_enum" NOT NULL, "provider_user_id" character varying(128) NOT NULL, "user_id" uuid NOT NULL, "profile" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "PK_e23bff04e9c3e7b785e442b262c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_bd1b586943a2a13643a6d1878e" ON "user_identities"  ("provider", "provider_user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version_id" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "full_name" character varying(255) NOT NULL, "phone" character varying(20), "email" character varying(255), "avatar_url" character varying(512), "locale" character varying(8), "is_blocked" boolean NOT NULL DEFAULT false, "last_login_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4a72568549ccd19b63035860a2" ON "users"  ("phone") WHERE phone IS NOT NULL AND deleted_at IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_offices" ADD CONSTRAINT "FK_682aa93f2d07f6d681d0cfc3428" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "districts" ADD CONSTRAINT "FK_4271e8e205bbdce31975c55ed3f" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_identities" ADD CONSTRAINT "FK_bf5fe01eb8cad7114b4c371cdc7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_identities" DROP CONSTRAINT "FK_bf5fe01eb8cad7114b4c371cdc7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "districts" DROP CONSTRAINT "FK_4271e8e205bbdce31975c55ed3f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_offices" DROP CONSTRAINT "FK_682aa93f2d07f6d681d0cfc3428"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4a72568549ccd19b63035860a2"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bd1b586943a2a13643a6d1878e"`,
    );
    await queryRunner.query(`DROP TABLE "user_identities"`);
    await queryRunner.query(
      `DROP TYPE "public"."user_identities_provider_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_369af14792a93be58c0a9f442b"`,
    );
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2bd10c164897426ac070d03e2b"`,
    );
    await queryRunner.query(`DROP TABLE "languages"`);
    await queryRunner.query(`DROP TABLE "districts"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bfd6a40a585e4f1cdc3a51acd8"`,
    );
    await queryRunner.query(`DROP TABLE "post_offices"`);
    await queryRunner.query(`DROP TABLE "regions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_60edb560e55276b88b098f4bb6"`,
    );
    await queryRunner.query(`DROP TABLE "admin_users"`);
    await queryRunner.query(`DROP TYPE "public"."admin_users_role_enum"`);
  }
}
