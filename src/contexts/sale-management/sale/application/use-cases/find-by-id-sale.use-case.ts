import { SaleEntity } from "../../domain/entities/sale.entity";
import { SaleNotFoundException } from "../../domain/exceptions/sale-not-found.exception";
import { SaleRepository } from "../../domain/repositories/sale.repository";

export class FindByIdSaleUseCase{
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(saleId: bigint):Promise<SaleEntity>{
        try {
            const result = await this.repository.findById(saleId);
            if(!result){
                throw new SaleNotFoundException('No se encontro la venta con id ' + saleId );
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
}