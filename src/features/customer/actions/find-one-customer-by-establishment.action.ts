'use server';

import { cookies } from "next/headers";
import { FindAllCustomerByEstablishmentUseCase } from "../application/use-cases/find-all-customer-by-establishment.use-case";
import { CustomerRepositoryFactory } from "../infraestructure/factory/customer-repository.factory";
import { EstablishmentEntity } from "@/features/establishment/domain/entities/establishment.entity";
import { FindOneCustomerByEstablishmentUseCase } from "../application/use-cases/find-one-customer-by-establishment.use-case";

export async function findOneCustomerByEstablishmentAction(customerId: bigint) {
    const repository = CustomerRepositoryFactory.create();
    const useCase = new FindOneCustomerByEstablishmentUseCase(repository);
    const cookieStore = await cookies();
    let establishment;

    if(cookieStore.has('establishmentCookie')){
        establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        if(establishment){
            establishment = JSON.parse(establishment) as EstablishmentEntity;
            console.log(establishment);
            const result = await useCase.execute(customerId, establishment.establishmentId);
            return {
                ...result
            }
        }
    } else {
        const result = await useCase.execute(BigInt(0), BigInt(0));
        return {
            ...result
        }
    }
}