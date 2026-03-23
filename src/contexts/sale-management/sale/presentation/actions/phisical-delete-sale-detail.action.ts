'use server';
import { PhysicalDeleteSaleDetailUseCase } from "../../../../../features/sale/application/use-case/physical-delete-sale-detail.use-case";
import { SaleRepositoryFactory } from "../../../../../features/sale/infraestructure/factory/sale-repository.factory";

export async function physicalDeleteSaleDetailAction(saleId: bigint, detailId: bigint){
    const repository = SaleRepositoryFactory.create();
    const useCase = new PhysicalDeleteSaleDetailUseCase(repository);

    const result = await useCase.execute(saleId, detailId);
    
    return {
        ...result
    }
}