import { Result } from "@/shared/features/result";
import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";
import { SaleRepository } from "../../domain/repositories/sale.repository";
import { FinalizeSaleDto } from "../dtos/finalize-sale.dto";
import { ErrorEntity } from "@/shared/features/error.entity";

export class PendingSaleUseCase {
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(saleId: bigint, dto: Omit<FinalizeSaleDto, 'status'>){
        if(dto.customerId === BigInt(0)){
            return Result.failure<ErrorEntity>({
                error: '404: Cliente no seleccionado',
                message: 'Debes seleccionar un cliente para finalizar.',
                statusCode: 404,
                path: 'sales.pending',
                timestamp: new Date().toISOString()
            });
        }
        const formatDTO: FinalizeSaleDto = {
            ...dto,
            status: SaleStatusEnum.PENDING,
            salePayments: undefined,
        }
        const result = await this.repository.finalizeSale(saleId, formatDTO);
        return result;
    }
}