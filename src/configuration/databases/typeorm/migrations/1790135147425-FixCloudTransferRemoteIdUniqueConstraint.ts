import { MigrationInterface, QueryRunner } from "typeorm";

export class FixCloudTransferRemoteIdUniqueConstraint1790135147425 implements MigrationInterface {
    name = 'FixCloudTransferRemoteIdUniqueConstraint1790135147425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cloud_transfer" DROP CONSTRAINT "UQ_eecc204404be7276b5128a53495"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6c8ab25d4a9635c4b94a658b75" ON "cloud_transfer" ("remote_cloud_transfer_id", "direction") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_6c8ab25d4a9635c4b94a658b75"`);
        await queryRunner.query(`ALTER TABLE "cloud_transfer" ADD CONSTRAINT "UQ_eecc204404be7276b5128a53495" UNIQUE ("remote_cloud_transfer_id")`);
    }

}
