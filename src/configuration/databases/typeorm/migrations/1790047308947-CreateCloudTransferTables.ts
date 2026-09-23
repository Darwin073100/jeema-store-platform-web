import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCloudTransferTables1790047308947 implements MigrationInterface {
    name = 'CreateCloudTransferTables1790047308947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // NOTA: el generador de TypeORM también proponía DROP/CREATE de
        // "IDX_establishment_detail_singleton_type" (un índice parcial único preexistente que no está
        // representado en los decoradores de `EstablishmentDetailOrmEntity` — drift preexistente, no
        // relacionado con esta feature). Se removió esa línea deliberadamente de este archivo: esta
        // migración solo debe tocar `cloud_transfer`/`cloud_transfer_item`, nada más.
        await queryRunner.query(`CREATE TYPE "public"."cloud_transfer_item_product_unit_of_measure_enum" AS ENUM('kg', 'l', 'm', 'pc', 'doc', 'paquete', 'caja', 'set')`);
        await queryRunner.query(`CREATE TYPE "public"."cloud_transfer_item_lot_purchase_unit_enum" AS ENUM('kg', 'l', 'm', 'pc', 'doc', 'paquete', 'caja', 'set')`);
        await queryRunner.query(`CREATE TYPE "public"."cloud_transfer_item_inventory_suggested_location_enum" AS ENUM('venta', 'almacen', 'dañado', 'viajando')`);
        await queryRunner.query(`CREATE TYPE "public"."cloud_transfer_item_resolution_status_enum" AS ENUM('Pending', 'Matched', 'NewProduct', 'Rejected')`);
        await queryRunner.query(`CREATE TABLE "cloud_transfer_item" ("cloud_transfer_item_id" BIGSERIAL NOT NULL, "cloud_transfer_id" bigint NOT NULL, "line_number" integer NOT NULL, "origin_local_product_id" bigint, "origin_local_lot_id" bigint, "origin_local_inventory_item_id" bigint, "product_universal_bar_code" character varying(100), "product_name" character varying(150) NOT NULL, "product_sku" character varying(50), "product_category_name" character varying(100) NOT NULL, "product_category_description" text, "product_brand_name" character varying(100), "product_description" text, "product_unit_of_measure" "public"."cloud_transfer_item_product_unit_of_measure_enum" NOT NULL, "product_image_url" character varying(255), "lot_number" character varying(50) NOT NULL, "lot_purchase_price" numeric(12,4) NOT NULL, "lot_purchase_unit" "public"."cloud_transfer_item_lot_purchase_unit_enum" NOT NULL, "lot_transferred_quantity" numeric(18,3) NOT NULL, "lot_expiration_date" date, "lot_manufacturing_date" date, "lot_origin_received_date" date, "lot_supplier_name" character varying(150), "inventory_suggested_sale_price_one" numeric(12,2), "inventory_suggested_sale_price_many" numeric(12,2), "inventory_suggested_sale_quantity_many" numeric(18,4), "inventory_suggested_sale_price_special" numeric(12,2), "inventory_origin_quantity_on_hand" numeric(18,3), "inventory_suggested_location" "public"."cloud_transfer_item_inventory_suggested_location_enum", "resolution_status" "public"."cloud_transfer_item_resolution_status_enum" NOT NULL DEFAULT 'Pending', "matched_local_product_id" bigint, "matched_local_category_id" bigint, "matched_local_inventory_id" bigint, "matched_local_lot_id" bigint, "matched_local_inventory_item_id" bigint, "auto_matched_by_barcode" boolean NOT NULL DEFAULT false, "rejection_reason" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_a75ba5dd59caedddaecc26d85a8" PRIMARY KEY ("cloud_transfer_item_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d0f2c2d751107838167a44dd99" ON "cloud_transfer_item" ("product_universal_bar_code") `);
        await queryRunner.query(`CREATE INDEX "IDX_7ba687f0421d261ca9f00a6edc" ON "cloud_transfer_item" ("cloud_transfer_id", "resolution_status") `);
        await queryRunner.query(`CREATE INDEX "IDX_54a9db8bd3730542a7acabe50f" ON "cloud_transfer_item" ("cloud_transfer_id") `);
        await queryRunner.query(`CREATE TYPE "public"."cloud_transfer_direction_enum" AS ENUM('Saliente', 'Entrante')`);
        await queryRunner.query(`CREATE TYPE "public"."cloud_transfer_status_enum" AS ENUM('Pendiente', 'En_Transito', 'Recibida', 'Aprobada', 'Cancelada', 'Error')`);
        await queryRunner.query(`CREATE TABLE "cloud_transfer" ("cloud_transfer_id" BIGSERIAL NOT NULL, "remote_cloud_transfer_id" bigint, "direction" "public"."cloud_transfer_direction_enum" NOT NULL, "from_branch_office_id" bigint, "from_cloud_branch_office_id" bigint NOT NULL, "to_branch_office_id" bigint, "to_cloud_branch_office_id" bigint NOT NULL, "status" "public"."cloud_transfer_status_enum" NOT NULL, "shipment_notes" character varying(500), "resolution_notes" text, "error_message" character varying(1000), "requested_by_employee_id" bigint, "processed_by_employee_id" bigint, "last_synced_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "UQ_eecc204404be7276b5128a53495" UNIQUE ("remote_cloud_transfer_id"), CONSTRAINT "PK_62f00fc404382d0a3e4ee931289" PRIMARY KEY ("cloud_transfer_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bf25395495300e80fdd9186dc0" ON "cloud_transfer" ("direction") `);
        await queryRunner.query(`CREATE INDEX "IDX_50ab036df97f2fea6634c7c27a" ON "cloud_transfer" ("to_branch_office_id", "status") `);
        await queryRunner.query(`CREATE INDEX "IDX_eb77d45a492c4e26c61c970ecd" ON "cloud_transfer" ("from_branch_office_id", "status") `);
        await queryRunner.query(`ALTER TABLE "cloud_transfer_item" ADD CONSTRAINT "FK_54a9db8bd3730542a7acabe50f6" FOREIGN KEY ("cloud_transfer_id") REFERENCES "cloud_transfer"("cloud_transfer_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer_item" ADD CONSTRAINT "FK_9ecad802519da8dd9ad2d608486" FOREIGN KEY ("matched_local_product_id") REFERENCES "product"("product_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer_item" ADD CONSTRAINT "FK_dde527e98a5f5efb13a8e4d961c" FOREIGN KEY ("matched_local_category_id") REFERENCES "category"("category_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer_item" ADD CONSTRAINT "FK_39c749187ab34499c36e16ecc6d" FOREIGN KEY ("matched_local_inventory_id") REFERENCES "inventory"("inventory_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer_item" ADD CONSTRAINT "FK_f05b705ccf2d459255bbba9961e" FOREIGN KEY ("matched_local_lot_id") REFERENCES "lot"("lot_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer_item" ADD CONSTRAINT "FK_de0c66eece0da07fd86d9fa3aac" FOREIGN KEY ("matched_local_inventory_item_id") REFERENCES "inventory_item"("inventory_item_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer" ADD CONSTRAINT "FK_0e0e9d35a1eedb6459f628bae69" FOREIGN KEY ("from_branch_office_id") REFERENCES "branch_office"("branch_office_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer" ADD CONSTRAINT "FK_569ee0752e7c485b05a52fb055e" FOREIGN KEY ("to_branch_office_id") REFERENCES "branch_office"("branch_office_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer" ADD CONSTRAINT "FK_d9d7109abdea36d81dd150993d3" FOREIGN KEY ("requested_by_employee_id") REFERENCES "employee"("employee_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer" ADD CONSTRAINT "FK_5753a4bc3edc39be2e3cb008672" FOREIGN KEY ("processed_by_employee_id") REFERENCES "employee"("employee_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cloud_transfer" DROP CONSTRAINT "FK_5753a4bc3edc39be2e3cb008672"`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer" DROP CONSTRAINT "FK_d9d7109abdea36d81dd150993d3"`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer" DROP CONSTRAINT "FK_569ee0752e7c485b05a52fb055e"`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer" DROP CONSTRAINT "FK_0e0e9d35a1eedb6459f628bae69"`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer_item" DROP CONSTRAINT "FK_de0c66eece0da07fd86d9fa3aac"`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer_item" DROP CONSTRAINT "FK_f05b705ccf2d459255bbba9961e"`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer_item" DROP CONSTRAINT "FK_39c749187ab34499c36e16ecc6d"`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer_item" DROP CONSTRAINT "FK_dde527e98a5f5efb13a8e4d961c"`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer_item" DROP CONSTRAINT "FK_9ecad802519da8dd9ad2d608486"`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer_item" DROP CONSTRAINT "FK_54a9db8bd3730542a7acabe50f6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eb77d45a492c4e26c61c970ecd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_50ab036df97f2fea6634c7c27a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bf25395495300e80fdd9186dc0"`);
        await queryRunner.query(`DROP TABLE "cloud_transfer"`);
        await queryRunner.query(`DROP TYPE "public"."cloud_transfer_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."cloud_transfer_direction_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_54a9db8bd3730542a7acabe50f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7ba687f0421d261ca9f00a6edc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d0f2c2d751107838167a44dd99"`);
        await queryRunner.query(`DROP TABLE "cloud_transfer_item"`);
        await queryRunner.query(`DROP TYPE "public"."cloud_transfer_item_resolution_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."cloud_transfer_item_inventory_suggested_location_enum"`);
        await queryRunner.query(`DROP TYPE "public"."cloud_transfer_item_lot_purchase_unit_enum"`);
        await queryRunner.query(`DROP TYPE "public"."cloud_transfer_item_product_unit_of_measure_enum"`);
    }

}
