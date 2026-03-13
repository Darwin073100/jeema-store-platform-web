import { PaymentMethodEntity } from "../../domain/entities/payment-method-entity";
import { PaymentMethodNotFoundException } from "../../domain/exceptions/payment-method-not-found.exception";
import { PaymentMethodRepository } from "../../domain/repositories/payment-method.repository";
import { PaymentMethodNameVO } from "../../domain/value-objects/payment-method-name.vo";
import { UpdatePaymentMethodDTO } from "../dtos/update-payment-method.dto";

export class UpdatedPaymentMethodUseCase {
    constructor(
        private readonly repository: PaymentMethodRepository,
    ) {}

    async execute(command: UpdatePaymentMethodDTO): Promise<PaymentMethodEntity> {
        const category = await this.repository.findById(command.paymentMethodId);
        if (!category) {
            throw new PaymentMethodNotFoundException('Metodo de pago no encontrado.');
        }

        category.updateName(PaymentMethodNameVO.create(command.name));
        category.updateRequiresReference(command.requiresReference);

        return this.repository.save(category);
    }
}