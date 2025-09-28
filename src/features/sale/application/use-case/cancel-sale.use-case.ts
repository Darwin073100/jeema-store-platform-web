import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";
import { SaleRepository } from "../../domain/repositories/sale.repository";
import { FinalizeSaleDto } from "../dtos/finalize-sale.dto";

export class CancelSaleUseCase {
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(saleId: bigint, dto: Omit<FinalizeSaleDto, 'status'>){
        const formatDTO: FinalizeSaleDto = {
            ...dto,
            status: SaleStatusEnum.CANCELLED
        }
        const result = await this.repository.finalizeSale(saleId, formatDTO);
        return result;
    }
}