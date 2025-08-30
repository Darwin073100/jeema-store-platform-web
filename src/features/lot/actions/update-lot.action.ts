'use server'
import { UpdateLotDTO } from "../application/dtos/update-lot.dto";
import { UpdateLotUseCase } from "../application/use-case/update-lot.use-case";
import { LotFetchRepositoryImpl } from "../infraestructure/lot-fetch-repository.impl";

export async function updateLotAction(dto: UpdateLotDTO){
    const lotFetchRepositoryImpl  = new LotFetchRepositoryImpl();
    const updateLotUseCase = new UpdateLotUseCase(lotFetchRepositoryImpl);

    const result = await updateLotUseCase.execute(dto);
    
    return {
        ...result
    };
}