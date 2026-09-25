import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmployeeToSalePayment1790307181069 implements MigrationInterface {
    name = 'AddEmployeeToSalePayment1790307181069'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Columna nullable primero: no se puede agregar NOT NULL directamente porque ya existen
        // sale_payment de la feature "venta a crédito" (previa a esta adenda).
        await queryRunner.query(`ALTER TABLE "sale_payment" ADD "employee_id" bigint`);
        // Backfill determinista: todo sale_payment existente pertenece al flujo de pago completo al
        // cobrar, así que hereda el employee_id de la venta a la que pertenece (ver decisión 2 de la
        // adenda en spect/10_venta_a_credito_spect.md).
        await queryRunner.query(`
            UPDATE "sale_payment" sp SET "employee_id" = s."employee_id"
            FROM "sale" s WHERE s."sale_id" = sp."sale_id" AND sp."employee_id" IS NULL
        `);
        await queryRunner.query(`ALTER TABLE "sale_payment" ALTER COLUMN "employee_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale_payment" ADD CONSTRAINT "FK_83952fe3de99b5623d55fbdc8a0" FOREIGN KEY ("employee_id") REFERENCES "employee"("employee_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_payment" DROP CONSTRAINT "FK_83952fe3de99b5623d55fbdc8a0"`);
        await queryRunner.query(`ALTER TABLE "sale_payment" DROP COLUMN "employee_id"`);
    }

}
