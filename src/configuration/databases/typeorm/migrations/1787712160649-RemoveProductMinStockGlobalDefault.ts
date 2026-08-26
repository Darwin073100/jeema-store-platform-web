import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveProductMinStockGlobalDefault1787712160649 implements MigrationInterface {
    name = 'RemoveProductMinStockGlobalDefault1787712160649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "min_stock_global" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "min_stock_global" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "product" SET "min_stock_global" = 0 WHERE "min_stock_global" IS NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "min_stock_global" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "min_stock_global" SET NOT NULL`);
    }

}
