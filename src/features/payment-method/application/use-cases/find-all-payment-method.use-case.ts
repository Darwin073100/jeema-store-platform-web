import { PaymentMethodRepository } from "../../domain/repositories/payment-method.repository";

export class FindAllPaymentMethodUseCase {
    constructor(
        private readonly repository: PaymentMethodRepository
    ){}

    async execute(){
        const result = await this.repository.findAll();
        return result;
    }
}