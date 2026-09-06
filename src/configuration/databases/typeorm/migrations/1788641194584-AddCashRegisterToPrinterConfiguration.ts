import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCashRegisterToPrinterConfiguration1788641194584 implements MigrationInterface {
    name = 'AddCashRegisterToPrinterConfiguration1788641194584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // AJUSTE MANUAL (ver spect/06_impresora_por_caja_spect.md, "Paso 1"): `pnpm run
        // migration:generate` diffea la entity contra la tabla y, al ver que `branch_office_id`
        // desapareció de PrinterConfigurationOrmEntity mientras `cash_register_id` apareció con el
        // mismo tipo, propone un RENAME COLUMN + DROP de la FK/constraint vieja — es decir, colapsa
        // Paso 1 y Paso 2 del plan de migración en dos pasos en una sola migración irreversible.
        // Eso es exactamente lo que este cambio busca evitar: cada fila existente de
        // `printer_configuration` está ligada a `branch_office_id`, y decidir a qué `cash_register_id`
        // corresponde cada una es una decisión de negocio manual por sitio (ver "Paso manual" del
        // spec) — no se puede inferir con un simple RENAME. Por eso aquí se reemplaza el RENAME
        // generado por un ADD COLUMN nullable nuevo, dejando `branch_office_id` y su FK original
        // intactas; el DROP de esa columna/constraint se hace en la migración
        // `MakeCashRegisterRequiredOnPrinterConfiguration`, después del paso manual de datos.
        //
        // También se removió el DROP/CREATE de "IDX_establishment_detail_singleton_type" que el
        // generador propuso: es un índice único parcial creado por SQL crudo (AddEstablishmentDetail)
        // no representable por decoradores @Index de TypeORM, por lo que aparece como "drift" en
        // cualquier migration:generate futura — igual que se documentó en
        // 1787801025682-add-printer-configuration.ts. No tiene relación con este cambio.
        await queryRunner.query(`ALTER TABLE "printer_configuration" ADD COLUMN "cash_register_id" bigint`);
        await queryRunner.query(`ALTER TABLE "printer_configuration" ADD CONSTRAINT "FK_a131c144ac9f927afdda62b6a96" FOREIGN KEY ("cash_register_id") REFERENCES "cash_register"("cash_register_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "printer_configuration" DROP CONSTRAINT "FK_a131c144ac9f927afdda62b6a96"`);
        await queryRunner.query(`ALTER TABLE "printer_configuration" DROP COLUMN "cash_register_id"`);
    }

}
