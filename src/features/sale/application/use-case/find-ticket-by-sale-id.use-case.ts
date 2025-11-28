import { Result } from "@/shared/features/result";
import { SaleRepository } from "../../domain/repositories/sale.repository";
import { ErrorEntity } from "@/shared/features/error.entity";

export class FindTicketBySaleIdUseCase {
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(saleId: bigint){
        if(saleId <= BigInt(0)){
            return Result.failure<ErrorEntity>({
                message: 'No se encontro una venta',
                error: 'Sale not found.',
                statusCode: 404,
                path: 'FindTicketBySaleIdUseCase',
                timestamp: new Date().toJSON(),
            });
        }
        const result = await this.repository.findTickedBySaleId(saleId);
        return result;
    }
}