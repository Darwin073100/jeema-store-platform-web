import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUnitCostAtSaleToSaleDetail1789070665606 implements MigrationInterface {
    name = 'AddUnitCostAtSaleToSaleDetail1789070665606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // NOTA: el generador de TypeORM también propuso DROP de "IDX_establishment_detail_singleton_type"
        // (mismo drift ajeno ya documentado en 1787801025682-add-printer-configuration.ts,
        // 1788641194584-AddCashRegisterToPrinterConfiguration.ts, 1788642580231-MakeCashRegisterRequiredOnPrinterConfiguration.ts
        // y 1789070608914-AddAverageCostToProduct.ts — índice único parcial creado por SQL crudo, no
        // representable por decoradores @Index). Se removió a mano por no tener relación con este cambio.
        await queryRunner.query(`ALTER TABLE "sale_detail" ADD "unit_cost_at_sale" numeric(14,4)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_detail" DROP COLUMN "unit_cost_at_sale"`);
    }

}
