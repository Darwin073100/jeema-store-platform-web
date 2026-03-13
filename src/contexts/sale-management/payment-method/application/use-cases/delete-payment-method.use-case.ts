import { PaymentMethodNotFoundException } from "../../domain/exceptions/payment-method-not-found.exception";
import { PaymentMethodRepository } from "../../domain/repositories/payment-method.repository";

export class DeletePaymentMethodUseCase {
    constructor(
        private readonly repository: PaymentMethodRepository,
    ) {}

    async execute(entityId: bigint): Promise<void> {
        const paymentMethod = await this.repository.findById(entityId);
        if (!paymentMethod) {
            throw new PaymentMethodNotFoundException('Método de págo no encontrado.');
        }
        await this.repository.delete(entityId);
    }
}