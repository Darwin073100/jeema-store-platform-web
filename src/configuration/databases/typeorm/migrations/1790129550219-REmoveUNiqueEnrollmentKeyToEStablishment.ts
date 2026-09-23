import { MigrationInterface, QueryRunner } from "typeorm";

export class REmoveUNiqueEnrollmentKeyToEStablishment1790129550219 implements MigrationInterface {
    name = 'REmoveUNiqueEnrollmentKeyToEStablishment1790129550219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_establishment_detail_singleton_type"`);
        await queryRunner.query(`ALTER TABLE "establishment" DROP CONSTRAINT "UQ_0de875a393b6ec2c01b1770ae1e"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "establishment" ADD CONSTRAINT "UQ_0de875a393b6ec2c01b1770ae1e" UNIQUE ("enrollment_key")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_establishment_detail_singleton_type" ON "establishment_detail" ("establishment_id", "type") WHERE ((type <> ALL (ARRAY['PHONE_NUMBER'::establishment_detail_type_enum, 'WHATSAPP'::establishment_detail_type_enum])) AND (deleted_at IS NULL))`);
    }

}
