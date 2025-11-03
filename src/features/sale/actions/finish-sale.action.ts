'use server';
import { revalidatePath } from "next/cache";
import { FinishSaleDto } from "../application/dtos/finish-sale.dto";
import { FinishSaleUseCase } from "../application/use-case/finish-sale.use-case";
import { SaleRepositoryFactory } from "../infraestructure/factory/sale-repository.factory";

export async function finishSaleAction(saleId: bigint, dto: FinishSaleDto){
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