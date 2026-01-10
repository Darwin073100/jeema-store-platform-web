'use server';

import { cookies } from "next/headers";
import { FindAllCustomerByEstablishmentUseCase } from "../application/use-cases/find-all-customer-by-establishment.use-case";
import { CustomerRepositoryFactory } from "../infraestructure/factory/customer-repository.factory";
import { EstablishmentEntity } from "@/features/establishment/domain/entities/establishment.entity";

export async function findAllCustomerByEstablishmentAction() {
    const repository = CustomerRepositoryFactory.create();
    const useCase = new FindAllCustomerByEstablishmentUseCase(repository);
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