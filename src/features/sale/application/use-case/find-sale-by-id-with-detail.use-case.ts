import { SaleRepository } from "../../domain/repositories/sale.repository";

export class FindSaleByIdWithDetailUseCase {
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(saleId: bigint){
        const result = await this.repository.findSaleWithDetails(saleId);
        return result;
    }
}