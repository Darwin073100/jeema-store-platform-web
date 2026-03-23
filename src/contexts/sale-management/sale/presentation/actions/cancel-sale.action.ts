'use server';
import { FinalizeSaleDto } from "../../../../../features/sale/application/dtos/finalize-sale.dto";
import { CancelSaleUseCase } from "../../../../../features/sale/application/use-case/cancel-sale.use-case";
import { SaleRepositoryFactory } from "../../../../../features/sale/infraestructure/factory/sale-repository.factory";

export async function cancelSaleAction(saleId: bigint, dto: Omit<FinalizeSaleDto, 'status'>){
    const repository = SaleRepositoryFactory.create();
    const useCase = new CancelSaleUseCase(repository);

    const result = await useCase.execute(saleId, dto);
    
    return {
        ...result
    }
}