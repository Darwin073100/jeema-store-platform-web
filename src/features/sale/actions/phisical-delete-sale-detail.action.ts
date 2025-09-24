'use server';
import { PhysicalDeleteSaleDetailUseCase } from "../application/use-case/physical-delete-sale-detail.use-case";
import { SaleRepositoryFactory } from "../infraestructure/factory/sale-repository.factory";

export async function physicalDeleteSaleDetailAction(saleId: bigint, detailId: bigint){
    const repository = SaleRepositoryFactory.create();
    const useCase = new PhysicalDeleteSaleDetailUseCase(repository);

    const result = await useCase.execute(saleId, detailId);
    
    return {
        ...result
    }
}