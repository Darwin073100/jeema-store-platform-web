'use server'
import { RegisterLotDTO } from "../application/dtos/register-lot.dto";
import { RegisterLotUseCase } from "../application/use-case/register-lot.use-case";
import { LotFetchRepositoryImpl } from "../infraestructure/lot-fetch-repository.impl";

export async function registerLotAction(dto: RegisterLotDTO){
    const lotFetchRepositoryImpl  = new LotFetchRepositoryImpl();
    const registerLotUseCase = new RegisterLotUseCase(lotFetchRepositoryImpl);

    const result = await registerLotUseCase.execute(dto);
    
    return {
        ...result
    };
}