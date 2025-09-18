'use server';
import { FindSaleByIdWithDetailUseCase } from "../application/use-case/find-sale-by-id-with-detail.use-case";
import { SaleRepositoryFactory } from "../infraestructure/factory/sale-repository.factory";

export async function findSaleWithDetailAction(saleId: bigint){
    const repository = SaleRepositoryFactory.create();
    const useCase = new FindSaleByIdWithDetailUseCase(repository);

    const result = await useCase.execute(saleId);
    
    return {
        ...result
    }
}