import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { ReturnsEntity } from "../entities/returns.entity";

export const RETURNS_REPOSITORY = Symbol('RETURNS_REPOSITORY');
export interface ReturnsRepository extends TemplateRepository<ReturnsEntity> {
    saveAll(entities: ReturnsEntity[]): Promise<ReturnsEntity[]>;
    findAllBySaleDetailId(saleDetailId: bigint): Promise<ReturnsEntity[]>;
    findAllByBranchOfficeId(branchOfficeId: bigint): Promise<ReturnsEntity[]>;
}