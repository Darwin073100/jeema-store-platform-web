'use server'
import { revalidatePath } from "next/cache";
import { LotRepositoryFactory } from "../infraestructure/factories/lot-repository.factory";
import { RegisterLotUnitPurchaseUseCase } from "../application/use-case/register-lot-purchase-unit.use-case";
import { AddLotUnitPurchaseDTO } from "../application/dtos/add-lot-unit-purchase.dto";

export async function registerLotUniPurchaseAction(dto: AddLotUnitPurchaseDTO){
    const lotFetchRepositoryImpl  = LotRepositoryFactory.create();
    const registerLotUnitPurchaseUseCase = new RegisterLotUnitPurchaseUseCase(lotFetchRepositoryImpl);

    const result = await registerLotUnitPurchaseUseCase.execute(dto);
    
    if(!!result.ok){
        revalidatePath('/products');
    }

    return {
        ...result
    };
}