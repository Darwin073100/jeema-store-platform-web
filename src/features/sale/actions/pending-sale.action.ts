'use server';
import { FinalizeSaleDto } from "../application/dtos/finalize-sale.dto";
import { PendingSaleUseCase } from "../application/use-case/pending-sale.use-case";
import { SaleRepositoryFactory } from "../infraestructure/factory/sale-repository.factory";

export async function pendingSaleAction(saleId: bigint, dto: Omit<FinalizeSaleDto, 'status'>){
    const repository = SaleRepositoryFactory.create();
    const useCase = new PendingSaleUseCase(repository);

    const result = await useCase.execute(saleId, dto);
    
    return {
        ...result
    }
}