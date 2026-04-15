import { MigrationInterface, QueryRunner } from "typeorm";

export class ConfigToCloudDB1776278913522 implements MigrationInterface {
    name = 'ConfigToCloudDB1776278913522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branch_office" ADD "cloud_branch_office_id" bigint`);
        await queryRunner.query(`ALTER TABLE "establishment" ADD "cloud_establishment_id" bigint`);
        await queryRunner.query(`ALTER TABLE "establishment" ADD "enrollment_key" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "establishment" ADD CONSTRAINT "UQ_0de875a393b6ec2c01b1770ae1e" UNIQUE ("enrollment_key")`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "UQ_359eebfa14279084a9592b32c42"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "UQ_359eebfa14279084a9592b32c42" UNIQUE ("rfc")`);
        await queryRunner.query(`ALTER TABLE "establishment" DROP CONSTRAINT "UQ_0de875a393b6ec2c01b1770ae1e"`);
        await queryRunner.query(`ALTER TABLE "establishment" DROP COLUMN "enrollment_key"`);
        await queryRunner.query(`ALTER TABLE "establishment" DROP COLUMN "cloud_establishment_id"`);
        await queryRunner.query(`ALTER TABLE "branch_office" DROP COLUMN "cloud_branch_office_id"`);
    }

}
