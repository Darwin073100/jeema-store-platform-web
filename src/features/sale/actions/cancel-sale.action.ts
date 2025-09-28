'use server';
import { FinalizeSaleDto } from "../application/dtos/finalize-sale.dto";
import { CancelSaleUseCase } from "../application/use-case/cancel-sale.use-case";
import { SaleRepositoryFactory } from "../infraestructure/factory/sale-repository.factory";

export async function cancelSaleAction(saleId: bigint, dto: Omit<FinalizeSaleDto, 'status'>){
    const repository = SaleRepositoryFactory.create();
    const useCase = new CancelSaleUseCase(repository);

    const result = await useCase.execute(saleId, dto);
    
    return {
        ...result
    }
}