import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { LotEntity } from "../entities/lot.entity";

export const LOT_REPOSITORY = Symbol('LOT_REPOSITORY');

export interface LotRepository extends TemplateRepository<LotEntity>{
    saveWithItems(entity: LotEntity): Promise<LotEntity>;
    findReport(branchOfficeId: bigint, dateInit: Date, dateFinish: Date): Promise<LotEntity[]>;
    existById(id: bigint): Promise<LotEntity | null>;
}