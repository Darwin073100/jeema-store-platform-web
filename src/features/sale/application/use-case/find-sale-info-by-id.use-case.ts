import { Result } from "@/shared/features/result";
import { SaleRepository } from "../../domain/repositories/sale.repository";
import { ErrorEntity } from "@/shared/features/error.entity";

export class FindSaleInfoByIdUseCase {
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(saleId: bigint){
        if(saleId <= BigInt(0)){
            return Result.failure<ErrorEntity>({
                message: 'No se encontro una venta',
                error: 'Sale not found.',
                statusCode: 404,
                path: 'FindSaleInfoByIdUseCase',
                timestamp: new Date().toJSON(),
            });
        }
        const result = await this.repository.findSaleInfoById(saleId);
        return result;
    }
}