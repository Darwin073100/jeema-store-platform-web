import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { SaleEntity } from "../entities/sale.entity";

export const SALE_REPOSITORY = Symbol('SALE_REPOSITORY');

export interface SaleRepository extends TemplateRepository<SaleEntity>{
    findAllByBranchOffice(branchOfficeId: bigint): Promise<SaleEntity[]>;
    findFinishSaleById(saleId: bigint): Promise<SaleEntity | null>;
    existById(saleId: bigint): Promise<boolean>;
    findSaleTicketById(saleId: bigint): Promise<SaleEntity | null>;
    findAllByBranchOfficeAndFilter(branchOfficeId: bigint, dateStart?: Date, dateEnd?: Date, search?:string): Promise<SaleEntity[]>;
    /**
     * Ventas por lote de IDs, con sus saleDetails, para cálculo de costo/invertido.
     * Debe devolver [] si saleIds está vacío (no ejecutar IN () vacío).
     */
    findManyWithDetailsByIds(saleIds: bigint[]): Promise<SaleEntity[]>;
}