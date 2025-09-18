'use server';
import { AddDetailToSaleDto } from "../application/dtos/add-detail-to-sale.dto";
import { AddDetailToSaleUseCase } from "../application/use-case/add-detail-to-sale.use-case";
import { SaleRepositoryFactory } from "../infraestructure/factory/sale-repository.factory";

export async function addDetailToSaleAction(saleId: bigint, dto: AddDetailToSaleDto){
    const repository = SaleRepositoryFactory.create();
    const useCase = new AddDetailToSaleUseCase(repository);

    const result = await useCase.execute(saleId, dto);
    
    return {
        ...result
    }
}