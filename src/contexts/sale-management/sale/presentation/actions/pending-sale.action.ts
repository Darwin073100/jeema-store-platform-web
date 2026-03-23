'use server';
import { FinalizeSaleDto } from "../../../../../features/sale/application/dtos/finalize-sale.dto";
import { PendingSaleUseCase } from "../../../../../features/sale/application/use-case/pending-sale.use-case";
import { SaleRepositoryFactory } from "../../../../../features/sale/infraestructure/factory/sale-repository.factory";

export async function pendingSaleAction(saleId: bigint, dto: Omit<FinalizeSaleDto, 'status'>){
    const repository = SaleRepositoryFactory.create();
    const useCase = new PendingSaleUseCase(repository);

    const result = await useCase.execute(saleId, dto);
    
    return {
        ...result
    }
}