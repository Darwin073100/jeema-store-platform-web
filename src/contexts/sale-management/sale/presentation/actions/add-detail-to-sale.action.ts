'use server';
import { AddDetailToSaleDto } from "../../../../../features/sale/application/dtos/add-detail-to-sale.dto";
import { AddDetailToSaleUseCase } from "../../../../../features/sale/application/use-case/add-detail-to-sale.use-case";
import { SaleRepositoryFactory } from "../../../../../features/sale/infraestructure/factory/sale-repository.factory";

export async function addDetailToSaleAction(saleId: bigint, dto: AddDetailToSaleDto){
    const repository = SaleRepositoryFactory.create();
    const useCase = new AddDetailToSaleUseCase(repository);

    const result = await useCase.execute(saleId, dto);
    
    return {
        ...result
    }
}