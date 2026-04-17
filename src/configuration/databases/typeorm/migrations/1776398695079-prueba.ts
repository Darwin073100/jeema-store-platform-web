import { MigrationInterface, QueryRunner } from "typeorm";

export class Prueba1776398695079 implements MigrationInterface {
    name = 'Prueba1776398695079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "UQ_359eebfa14279084a9592b32c42"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "UQ_359eebfa14279084a9592b32c42" UNIQUE ("rfc")`);
    }

}
