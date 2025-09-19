'use server';
import { RegisterSalePaymentItem } from "../application/dtos/register-sale-payment.dto";
import { RegisterSalePaymentUseCase } from "../application/use-case/register-sale-payment.use-case";
import { SaleRepositoryFactory } from "../infraestructure/factory/sale-repository.factory";

export async function registerSalePaymentAction(saleId: bigint, dtos: RegisterSalePaymentItem[]){
    const repository = SaleRepositoryFactory.create();
    const useCase = new RegisterSalePaymentUseCase(repository);

    const result = await useCase.execute(saleId, dtos);
    
    return {
        ...result
    }
}