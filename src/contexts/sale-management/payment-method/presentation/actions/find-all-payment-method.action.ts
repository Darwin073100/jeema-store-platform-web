'use server'
import { unstable_noStore } from "next/cache";
import { TypeormPaymentMethodRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-payment-method.repository";
import { ViewAllPaymentMethodUseCase } from "../../application/use-cases/view-all-payment-method.use-case";
import { Result } from "@/shared/features/result";
import { PaymentMethodMapper } from "../../application/mappers/payment-method-mapper";

export async function findAllPaymentMethodAction() {
    try {
        unstable_noStore();
        const repository = await TypeormPaymentMethodRepository.create();
        const useCase = new ViewAllPaymentMethodUseCase(repository);

        const result = await useCase.execute();
        console.log(result);
        return {
            ...Result.success({paymentMethods: result.map(item => PaymentMethodMapper.toIResponse(item))})
        }
    } catch (error) {
        console.log({error});
        return {
            ...Result.success({paymentMethods: []})
        }
    }
}