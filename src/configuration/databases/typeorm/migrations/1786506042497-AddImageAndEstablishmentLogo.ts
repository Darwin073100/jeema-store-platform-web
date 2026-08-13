import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageAndEstablishmentLogo1786506042497 implements MigrationInterface {
    name = 'AddImageAndEstablishmentLogo1786506042497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."image_owner_type_enum" AS ENUM('PRODUCT', 'EMPLOYEE', 'ESTABLISHMENT')`);
        await queryRunner.query(`CREATE TABLE "image" ("image_id" BIGSERIAL NOT NULL, "owner_type" "public"."image_owner_type_enum" NOT NULL, "owner_id" bigint NOT NULL, "storage_key" character varying(500) NOT NULL, "url" character varying(1000) NOT NULL, "mime_type" character varying(100) NOT NULL, "size_bytes" integer NOT NULL, "is_primary" boolean NOT NULL DEFAULT false, "sort_order" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7183f1fd51e26f9caeca68cd2fc" PRIMARY KEY ("image_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_image_primary_per_owner" ON "image" ("owner_type", "owner_id") WHERE "is_primary" = true AND "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_image_owner" ON "image" ("owner_type", "owner_id") `);
        await queryRunner.query(`ALTER TABLE "establishment" ADD "logo_url" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "establishment" DROP COLUMN "logo_url"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_image_owner"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_image_primary_per_owner"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`DROP TYPE "public"."image_owner_type_enum"`);
    }

}
