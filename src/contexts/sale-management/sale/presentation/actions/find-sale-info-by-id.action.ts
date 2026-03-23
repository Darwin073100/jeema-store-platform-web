'use server';
import { FindSaleInfoByIdUseCase } from "../../../../../features/sale/application/use-case/find-sale-info-by-id.use-case";
import { SaleRepositoryFactory } from "../../../../../features/sale/infraestructure/factory/sale-repository.factory";

export async function findSaleInfoByIdAction(saleId: bigint){
    const repository = SaleRepositoryFactory.create();
    const useCase = new FindSaleInfoByIdUseCase(repository);

    const result = await useCase.execute(saleId);
    
    return {
        ...result
    }
}