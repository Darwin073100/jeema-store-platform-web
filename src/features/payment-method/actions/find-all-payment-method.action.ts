'use server'
import { FindAllPaymentMethodUseCase } from "../application/use-cases/find-all-payment-method.use-case";
import { PaymentMethodRepositoryFactory } from "../infraestructure/factory/payment-method-repository.factory"

export async function findAllPaymentMethodAction(){
    const repository = PaymentMethodRepositoryFactory.create();
    const useCase = new FindAllPaymentMethodUseCase(repository);

    const result = await useCase.execute();

    return {
        ...result
    }
}