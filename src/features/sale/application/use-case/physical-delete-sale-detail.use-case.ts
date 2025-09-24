import { SaleRepository } from "../../domain/repositories/sale.repository";

export class PhysicalDeleteSaleDetailUseCase {
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(saleId: bigint, detailId: bigint){
        const result = await this.repository.physicalDeleteSaleDetail(saleId, detailId);
        return result;
    }
}