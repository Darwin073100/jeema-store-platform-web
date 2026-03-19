'use server'
import { revalidatePath } from "next/cache";
import { LotRepositoryFactory } from "../../../../../features/lot/infraestructure/factories/lot-repository.factory";
import { DeleteLotUseCase } from "../../../../../features/lot/application/use-case/delete-lot.use-case";

export async function deleteLotAction(lotId: bigint){
    const lotFetchRepositoryImpl  = LotRepositoryFactory.create();
    const deleteLotUseCase = new DeleteLotUseCase(lotFetchRepositoryImpl);

    const result = await deleteLotUseCase.execute(lotId);
    
    if(!!result?.ok){
        revalidatePath('/products');
    }

    return {
        ...result
    };
}