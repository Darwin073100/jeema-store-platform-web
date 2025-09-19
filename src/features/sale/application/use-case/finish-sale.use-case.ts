import { SaleRepository } from "../../domain/repositories/sale.repository";
import { FinishSaleDto } from "../dtos/finish-sale.dto";

export class FinishSaleUseCase {
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(saleId: bigint, dto: FinishSaleDto){
        const result = await this.repository.finishSale(saleId, dto);
        return result;
    }
}