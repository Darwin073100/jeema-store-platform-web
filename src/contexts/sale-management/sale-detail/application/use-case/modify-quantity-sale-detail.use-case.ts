import { SaleNotFoundException } from "src/contexts/sale-management/sale/domain/exceptions/sale-not-found.exception";
import { SaleDetailRepository } from "../../domain/repositories/sale-detail.repository";
import { SaleCheckerPort } from "src/contexts/sale-management/sale/domain/ports/out/sale-checker.port";

export class ModifyQuantitySaleDetailUseCase {
    constructor(
        private readonly repository: SaleDetailRepository,
        private readonly saleChackerPort: SaleCheckerPort,
    ){}

    async execute( saleId:bigint, detailId: bigint, quantity: number){

        const saleExist = await this.saleChackerPort.existById(saleId);
        if(!saleExist){
            throw new SaleNotFoundException(`La venta con id ${saleId} no existe.`);
        }

        const result = await this.repository.modifyQuantity(detailId, quantity);
        
        return result;
    }
}