import { SaleRepository } from "../../domain/repositories/sale.repository";

export class FindSaleInfoByIdUseCase {
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(saleId: bigint){
        const result = await this.repository.findSaleInfoById(saleId);
        return result;
    }
}