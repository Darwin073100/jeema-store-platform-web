import { SaleRepository } from "../../domain/repositories/sale.repository";
import { AddDetailToSaleDto } from "../dtos/add-detail-to-sale.dto";

export class AddDetailToSaleUseCase {
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(saleId: bigint, dto: AddDetailToSaleDto){
        const result = await this.repository.addDetailToSale(saleId, dto);
        return result;
    }
}