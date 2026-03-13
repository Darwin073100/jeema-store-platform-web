import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { CashRegisterEntity } from "../entities/cash-register.entity";

export const CASH_REGISTER_REPOSITORY = Symbol('CASH_REGISTER_REPOSITORY'); 

export interface CashRegisterRepository extends TemplateRepository<CashRegisterEntity>{
    existById(cashRegisterId: bigint): Promise<boolean>;
    findAllByBranchOfficeId(branchOfficeId: bigint): Promise<CashRegisterEntity[]>
}