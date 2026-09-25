import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreditSupportToSale1790305119052 implements MigrationInterface {
    name = 'AddCreditSupportToSale1790305119052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" ADD "paid_amount" numeric(14,4) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TYPE "public"."sale_status_enum" RENAME TO "sale_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."sale_status_enum" AS ENUM('inicializada', 'pendiente', 'completada', 'cancelada', 'reembolsada', 'credito')`);
        await queryRunner.query(`ALTER TABLE "sale" ALTER COLUMN "status" TYPE "public"."sale_status_enum" USING "status"::"text"::"public"."sale_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."sale_status_enum_old"`);

        // Backfill: ventas ya completadas/reembolsadas antes de este cambio se consideran liquidadas al 100%.
        await queryRunner.query(`UPDATE "sale" SET "paid_amount" = "total_amount" WHERE "status" IN ('completada', 'reembolsada')`);

        // Siembra el tipo de transacción "Abono a un Credito" para bases de datos ya existentes (desarrollo y
        // clientes on-prem que ya corrieron initial-data-postgres-script.sql antes de este cambio). El script de
        // seed para instalaciones nuevas ya tiene esta fila (initial-data-postgres-script.sql:116-117) — el
        // texto de "description" se copia tal cual del script (incluye el typo "abna" en vez de "abona") para
        // que ambas fuentes queden idénticas y TransactionTypeRepository.findByName('Abono a un Credito')
        // resuelva siempre la misma fila sin importar por cuál de las dos vías se sembró.
        await queryRunner.query(
            `INSERT INTO "transaction_type" ("name", "description", "account_type")
             SELECT 'Abono a un Credito', 'Cuando un cliente abna a un credito que ha solicitado de mercancía.', 'Ingreso'
             WHERE NOT EXISTS (SELECT 1 FROM "transaction_type" WHERE "name" = 'Abono a un Credito')`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "transaction_type" WHERE "name" = 'Abono a un Credito'`);

        await queryRunner.query(`CREATE TYPE "public"."sale_status_enum_old" AS ENUM('inicializada', 'pendiente', 'completada', 'cancelada', 'reembolsada')`);
        // Nota: Postgres no soporta quitar un valor de un enum sin recrear el tipo, y este ALTER falla si
        // quedan filas con status = 'credito' — trade-off esperado de cualquier ALTER TYPE ... ADD VALUE en
        // Postgres (ver spect/10_venta_a_credito_spect.md, sección "Base de datos — migración").
        await queryRunner.query(`ALTER TABLE "sale" ALTER COLUMN "status" TYPE "public"."sale_status_enum_old" USING "status"::"text"::"public"."sale_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."sale_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."sale_status_enum_old" RENAME TO "sale_status_enum"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "paid_amount"`);
    }

}
