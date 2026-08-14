import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEstablishmentDetail1786686803600 implements MigrationInterface {
    name = 'AddEstablishmentDetail1786686803600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."establishment_detail_type_enum" AS ENUM('PHONE_NUMBER', 'WHATSAPP', 'EMAIL', 'WEBSITE', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'SLOGAN')`);
        await queryRunner.query(`CREATE TABLE "establishment_detail" ("establishment_detail_id" BIGSERIAL NOT NULL, "establishment_id" bigint NOT NULL, "type" "public"."establishment_detail_type_enum" NOT NULL, "value" character varying(250) NOT NULL, "sort_order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b689e4b36b8571237f3ddc7365d" PRIMARY KEY ("establishment_detail_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_98a0acf331ef2532ba5a2e0196" ON "establishment_detail" ("establishment_id", "type") `);
        // Índice único parcial: refuerza a nivel de Postgres que los tipos "singleton"
        // (todos excepto PHONE_NUMBER/WHATSAPP, que sí admiten múltiples filas) tengan
        // como máximo una fila activa por establecimiento. Mismo mecanismo que
        // IDX_image_primary_per_owner en la migración AddImageAndEstablishmentLogo.
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_establishment_detail_singleton_type" ON "establishment_detail" ("establishment_id", "type") WHERE "type" NOT IN ('PHONE_NUMBER', 'WHATSAPP') AND "deleted_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "establishment_detail" ADD CONSTRAINT "FK_b254e9ee181144157d3d6b0dd8b" FOREIGN KEY ("establishment_id") REFERENCES "establishment"("establishment_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "establishment_detail" DROP CONSTRAINT "FK_b254e9ee181144157d3d6b0dd8b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_establishment_detail_singleton_type"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_98a0acf331ef2532ba5a2e0196"`);
        await queryRunner.query(`DROP TABLE "establishment_detail"`);
        await queryRunner.query(`DROP TYPE "public"."establishment_detail_type_enum"`);
    }

}
