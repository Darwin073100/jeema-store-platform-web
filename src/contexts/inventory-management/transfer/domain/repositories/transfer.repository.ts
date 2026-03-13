import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { TransferEntity } from "../entities/transafer.entity";

export const TRANSFER_REPOSITORY = Symbol('TRANSFER_REPOSITORY');

export interface TransferRepository extends TemplateRepository<TransferEntity> {
    findAllByBranchOffice(branchOfficeId: bigint): Promise<TransferEntity[]>;
}