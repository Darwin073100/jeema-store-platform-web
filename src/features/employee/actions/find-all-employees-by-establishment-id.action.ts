'use server'
import { cookies } from "next/headers";
import { unstable_noStore as noStore } from 'next/cache';
import { EstablishmentEntity } from "@/features/establishment/domain/entities/establishment.entity";
import { FindAllEmployeesByEstablishmentIdUseCase } from "../application/use-cases/find-all-employee-by-establishment-id.use-case";
import { EmployeeRepositoryFactory } from "../infraestructure/factories/employee-repository.factory";

export async function findAllEmployeesByEstablishmentIdAction(){
    noStore(); // Evitar que se cachée este server action
    const userFetchRepositoryImpl = EmployeeRepositoryFactory.create();
    const useCase = new FindAllEmployeesByEstablishmentIdUseCase(userFetchRepositoryImpl);
    
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