'use server'
import { RegisterLotDTO } from "../application/dtos/register-lot.dto";
import { RegisterLotUseCase } from "../application/use-case/register-lot.use-case";
import { LotRepositoryFactory } from "../infraestructure/factories/lot-repository.factory";

export async function registerLotAction(dto: RegisterLotDTO){
    const lotFetchRepositoryImpl  = LotRepositoryFactory.create();
    const registerLotUseCase = new RegisterLotUseCase(lotFetchRepositoryImpl);

    const result = await registerLotUseCase.execute(dto);
    
    return {
        ...result
    };
}