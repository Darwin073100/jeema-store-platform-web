'use server';
import { revalidatePath } from "next/cache";
import { RegisterSaleDto } from "../../../../../features/sale/application/dtos/register-sale.dto";
import { RegisterSaleInitialUseCase } from "../../../../../features/sale/application/use-case/register-sale-initial.use-case";
import { SaleRepositoryFactory } from "../../../../../features/sale/infraestructure/factory/sale-repository.factory";

export async function registerSaleInitialAction(dto: RegisterSaleDto){
    const repository = SaleRepositoryFactory.create();
    const useCase = new RegisterSaleInitialUseCase(repository);

    const result = await useCase.execute(dto);
    
    if(result.ok){
        revalidatePath('/sale');
    }

    return {
        ...result
    }
}