import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { LotUnitPurchaseEntity } from "../entities/lot-unit-purchase.entity";

export const LOT_UNIT_PURCHASE_REPOSITORY = Symbol('LOT_UNIT_PURCHASE_REPOSITORY');

export interface LotUnitPurchaseRepository extends TemplateRepository<LotUnitPurchaseEntity>{
    
}