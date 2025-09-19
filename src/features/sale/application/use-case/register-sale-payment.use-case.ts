import { SaleRepository } from "../../domain/repositories/sale.repository";
import { RegisterSalePaymentDto, RegisterSalePaymentItem } from "../dtos/register-sale-payment.dto";

export class RegisterSalePaymentUseCase {
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(saleId: bigint, dtoItems: RegisterSalePaymentItem[]) {
        // Adecuar el dto final, para el request.
        const dto: RegisterSalePaymentDto = {
            methods: dtoItems
        }

        const result = await this.repository.paidSale(saleId, dto);
        return result;
    }
}