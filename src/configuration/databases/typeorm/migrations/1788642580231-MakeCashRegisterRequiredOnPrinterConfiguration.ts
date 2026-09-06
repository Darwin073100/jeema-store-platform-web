import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeCashRegisterRequiredOnPrinterConfiguration1788642580231 implements MigrationInterface {
    name = 'MakeCashRegisterRequiredOnPrinterConfiguration1788642580231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // NOTA: el generador de TypeORM también propuso DROP/CREATE de
        // "IDX_establishment_detail_singleton_type" (mismo drift ajeno ya documentado en
        // 1787801025682-add-printer-configuration.ts y en 1788641194584-AddCashRegisterToPrinterConfiguration.ts
        // — índice único parcial creado por SQL crudo, no representable por decoradores @Index).
        // Se removió a mano por no tener relación con este cambio.
        await queryRunner.query(`ALTER TABLE "printer_configuration" DROP CONSTRAINT "FK_817ec5c4fff969f38f610c11aa5"`);
        await queryRunner.query(`ALTER TABLE "printer_configuration" DROP COLUMN "branch_office_id"`);
        await queryRunner.query(`ALTER TABLE "printer_configuration" DROP CONSTRAINT "FK_a131c144ac9f927afdda62b6a96"`);
        await queryRunner.query(`ALTER TABLE "printer_configuration" ALTER COLUMN "cash_register_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "printer_configuration" ADD CONSTRAINT "UQ_a131c144ac9f927afdda62b6a96" UNIQUE ("cash_register_id")`);
        await queryRunner.query(`ALTER TABLE "printer_configuration" ADD CONSTRAINT "FK_a131c144ac9f927afdda62b6a96" FOREIGN KEY ("cash_register_id") REFERENCES "cash_register"("cash_register_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // AJUSTE MANUAL: el "down" generado por TypeORM agregaba "branch_office_id" directamente como
        // NOT NULL, lo cual falla contra una tabla con filas existentes (no hay DEFAULT). Como
        // branch_office_id es derivable desde cash_register.branch_office_id, se agrega nullable,
        // se rellena con un UPDATE y recién después se vuelve NOT NULL — igual que describe
        // "Paso 2" en spect/06_impresora_por_caja_spect.md.
        await queryRunner.query(`ALTER TABLE "printer_configuration" DROP CONSTRAINT "FK_a131c144ac9f927afdda62b6a96"`);
        await queryRunner.query(`ALTER TABLE "printer_configuration" DROP CONSTRAINT "UQ_a131c144ac9f927afdda62b6a96"`);
        await queryRunner.query(`ALTER TABLE "printer_configuration" ALTER COLUMN "cash_register_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "printer_configuration" ADD CONSTRAINT "FK_a131c144ac9f927afdda62b6a96" FOREIGN KEY ("cash_register_id") REFERENCES "cash_register"("cash_register_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "printer_configuration" ADD COLUMN "branch_office_id" bigint`);
        await queryRunner.query(`UPDATE "printer_configuration" pc SET "branch_office_id" = cr."branch_office_id" FROM "cash_register" cr WHERE cr."cash_register_id" = pc."cash_register_id"`);
        await queryRunner.query(`ALTER TABLE "printer_configuration" ALTER COLUMN "branch_office_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "printer_configuration" ADD CONSTRAINT "FK_817ec5c4fff969f38f610c11aa5" FOREIGN KEY ("branch_office_id") REFERENCES "branch_office"("branch_office_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
