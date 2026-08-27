import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrinterConfiguration1787801025682 implements MigrationInterface {
    name = 'AddPrinterConfiguration1787801025682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // NOTA: el generador de TypeORM también propuso DROP/CREATE de
        // "IDX_establishment_detail_singleton_type" (índice único parcial creado por SQL crudo en
        // AddEstablishmentDetail, no representable por decoradores @Index de TypeORM — por eso
        // aparece como "drift" en cualquier migration:generate futura). Se removió a mano de esta
        // migración por ser ajeno a printer-configuration; no se toca el índice.
        await queryRunner.query(`CREATE TYPE "public"."printer_configuration_connection_type_enum" AS ENUM('QZ_OS_PRINTER', 'QZ_NETWORK', 'QZ_USB')`);
        await queryRunner.query(`CREATE TABLE "printer_configuration" ("printer_configuration_id" BIGSERIAL NOT NULL, "branch_office_id" bigint NOT NULL, "label" character varying(100) NOT NULL, "connection_type" "public"."printer_configuration_connection_type_enum" NOT NULL, "target" character varying(250) NOT NULL, "paper_width_mm" smallint NOT NULL, "auto_print_on_sale" boolean NOT NULL DEFAULT false, "open_cash_drawer" boolean NOT NULL DEFAULT false, "copies" smallint NOT NULL DEFAULT '1', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_05ea9a10c1acccebb1744a667b3" PRIMARY KEY ("printer_configuration_id"))`);
        await queryRunner.query(`ALTER TABLE "printer_configuration" ADD CONSTRAINT "FK_817ec5c4fff969f38f610c11aa5" FOREIGN KEY ("branch_office_id") REFERENCES "branch_office"("branch_office_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "printer_configuration" DROP CONSTRAINT "FK_817ec5c4fff969f38f610c11aa5"`);
        await queryRunner.query(`DROP TABLE "printer_configuration"`);
        await queryRunner.query(`DROP TYPE "public"."printer_configuration_connection_type_enum"`);
    }

}
