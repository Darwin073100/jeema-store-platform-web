'use server';
import { RegisterSaleDto } from "../application/dtos/register-sale.dto";
import { RegisterSaleInitialUseCase } from "../application/use-case/register-sale-initial.use-case";
import { SaleRepositoryFactory } from "../infraestructure/factory/sale-repository.factory";

export async function registerSaleInitialAction(dto: RegisterSaleDto){
    const repository = SaleRepositoryFactory.create();
    const useCase = new RegisterSaleInitialUseCase(repository);

    const result = await useCase.execute(dto);
    
    return {
        ...result
    }
}