import { SaleNotFoundException } from "../../domain/exceptions/sale-not-found.exception";
import { SaleRepository } from "../../domain/repositories/sale.repository";

export class DeletePaymentMethodUseCase {
    constructor(
        private readonly repository: SaleRepository,
    ) {}

    async execute(entityId: bigint): Promise<void> {
        const paymentMethod = await this.repository.findById(entityId);
        if (!paymentMethod) {
            throw new SaleNotFoundException('Método de págo no encontrado.');
        }
        await this.repository.delete(entityId);
    }
}