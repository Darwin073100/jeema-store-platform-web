'use server'
import { cookies } from "next/headers";
import { FindAllByEstablishmentIdUseCase } from "../../../../../features/auth/application/use-cases/find-all-by-establishment-id.use-case";
import { UserRepositoryFactory } from "../../../../../features/auth/infraestructure/factories/user-repository.factory";
import { EstablishmentEntity } from "@/features/establishment/domain/entities/establishment.entity";

export async function findAllByEstablishmentIdAction(){
    const userFetchRepositoryImpl = UserRepositoryFactory.create();
    const useCase = new FindAllByEstablishmentIdUseCase(userFetchRepositoryImpl);
    
    const cookieStore = await cookies();
    let establishment;

    if(cookieStore.has('establishmentCookie')){
        establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        if(establishment){
            establishment = JSON.parse(establishment) as EstablishmentEntity;
            const result = await useCase.execute(establishment.establishmentId);
            return {
                ...result
            }
        }
    } else {
        const result = await useCase.execute(BigInt(0));
        return {
            ...result
        }
    }
}