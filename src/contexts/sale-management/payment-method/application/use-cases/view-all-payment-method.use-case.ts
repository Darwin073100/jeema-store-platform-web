import { PaymentMethodEntity } from "../../domain/entities/payment-method-entity";
import { PaymentMethodRepository } from "../../domain/repositories/payment-method.repository";

export class ViewAllPaymentMethodUseCase{
    constructor(
        private readonly repository: PaymentMethodRepository
    ){}

    async execute():Promise<PaymentMethodEntity[]>{
        const result = await this.repository.findAll();
        return result;
    }
}