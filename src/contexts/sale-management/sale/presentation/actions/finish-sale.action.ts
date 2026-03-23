'use server';
import { revalidatePath } from "next/cache";
import { FinishSaleUseCase } from "../../../../../features/sale/application/use-case/finish-sale.use-case";
import { SaleRepositoryFactory } from "../../../../../features/sale/infraestructure/factory/sale-repository.factory";
import { FinalizeSaleDto } from "../../../../../features/sale/application/dtos/finalize-sale.dto";

export async function finishSaleAction(saleId: bigint, dto: FinalizeSaleDto){
    const repository = SaleRepositoryFactory.create();
    const useCase = new FinishSaleUseCase(repository);

    const result = await useCase.execute(saleId, dto);
    if(result.ok){
        revalidatePath('/sale');
        revalidatePath('/sale/new');
    }

    return {
        ...result
    }
}