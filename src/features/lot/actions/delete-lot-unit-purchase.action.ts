'use server'
import { revalidatePath } from "next/cache";
import { LotRepositoryFactory } from "../infraestructure/factories/lot-repository.factory";
import { DeleteLotUnitPurchaseUseCase } from "../application/use-case/delete-lot-purchase-unit.use-case";

export async function deleteLotUniPurchaseAction(lotId: bigint, lotUnitPurchaseId: bigint){
    const lotFetchRepositoryImpl  = LotRepositoryFactory.create();
    const deleteLotUnitPurchaseUseCase = new DeleteLotUnitPurchaseUseCase(lotFetchRepositoryImpl);

    const result = await deleteLotUnitPurchaseUseCase.execute(lotId, lotUnitPurchaseId);
    
    if(!!result?.ok){
        revalidatePath('/products');
    }

    return {
        ...result
    };
}