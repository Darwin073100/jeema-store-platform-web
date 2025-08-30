'use server'
import { revalidatePath } from "next/cache";
import { LotRepositoryFactory } from "../infraestructure/factories/lot-repository.factory";
import { UpdateLotUnitPurchaseUseCase } from "../application/use-case/update-lot-purchase-unit.use-case";
import { UpdateLotUnitPurchaseDTO } from "../application/dtos/update-lot-unit-purchase.dto";

export async function updateLotUniPurchaseAction(dto: UpdateLotUnitPurchaseDTO){
    const lotFetchRepositoryImpl  = LotRepositoryFactory.create();
    const updateLotUnitPurchaseUseCase = new UpdateLotUnitPurchaseUseCase(lotFetchRepositoryImpl);

    const result = await updateLotUnitPurchaseUseCase.execute(dto);
    
    if(!!result.ok){
        revalidatePath('/products');
    }

    return {
        ...result
    };
}