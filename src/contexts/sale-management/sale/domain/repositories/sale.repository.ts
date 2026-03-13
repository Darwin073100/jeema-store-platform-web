import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { SaleEntity } from "../entities/sale.entity";

export const SALE_REPOSITORY = Symbol('SALE_REPOSITORY');

export interface SaleRepository extends TemplateRepository<SaleEntity>{
    findAllByBranchOffice(branchOfficeId: bigint): Promise<SaleEntity[]>;
    findFinishSaleById(saleId: bigint): Promise<SaleEntity | null>;
    existById(saleId: bigint): Promise<boolean>;
    findSaleTicketById(saleId: bigint): Promise<SaleEntity | null>;
}