'use server';
import { revalidatePath } from "next/cache";
import { RegisterSalePaymentItem } from "../../../../../features/sale/application/dtos/register-sale-payment.dto";
import { RegisterSalePaymentUseCase } from "../../../../../features/sale/application/use-case/register-sale-payment.use-case";
import { SaleRepositoryFactory } from "../../../../../features/sale/infraestructure/factory/sale-repository.factory";

export async function registerSalePaymentAction(saleId: bigint, dtos: RegisterSalePaymentItem[]){
    const repository = SaleRepositoryFactory.create();
    const useCase = new RegisterSalePaymentUseCase(repository);

    const result = await useCase.execute(saleId, dtos);
    if(result.ok){
        revalidatePath('/sale');
    }
    
    return {
        ...result
    }
}