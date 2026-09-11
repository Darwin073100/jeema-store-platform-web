import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAverageCostToProduct1789070608914 implements MigrationInterface {
    name = 'AddAverageCostToProduct1789070608914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // NOTA: el generador de TypeORM también propuso DROP de "IDX_establishment_detail_singleton_type"
        // (mismo drift ajeno ya documentado en 1787801025682-add-printer-configuration.ts,
        // 1788641194584-AddCashRegisterToPrinterConfiguration.ts y
        // 1788642580231-MakeCashRegisterRequiredOnPrinterConfiguration.ts — índice único parcial
        // creado por SQL crudo, no representable por decoradores @Index). Se removió a mano por no
        // tener relación con este cambio.
        await queryRunner.query(`ALTER TABLE "product" ADD "average_cost" numeric(14,4) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "average_cost"`);
    }

}
