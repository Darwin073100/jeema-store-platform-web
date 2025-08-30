'use server'
import { revalidatePath } from "next/cache";
import { UpdateLotDTO } from "../application/dtos/update-lot.dto";
import { UpdateLotUseCase } from "../application/use-case/update-lot.use-case";
import { LotRepositoryFactory } from "../infraestructure/factories/lot-repository.factory";

export async function updateLotAction(dto: UpdateLotDTO){
    const lotFetchRepositoryImpl  = LotRepositoryFactory.create();
    const updateLotUseCase = new UpdateLotUseCase(lotFetchRepositoryImpl);

    const result = await updateLotUseCase.execute(dto);
    
    if(!!result.ok){
        revalidatePath('/products');
    }

    return {
        ...result
    };
}