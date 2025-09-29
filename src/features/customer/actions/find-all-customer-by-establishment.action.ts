'use server';

import { FindAllCustomerByEstablishmentUseCase } from "../application/use-cases/find-all-customer-by-establishment.use-case";
import { CustomerRepositoryFactory } from "../infraestructure/factory/customer-repository.factory";

export async function findAllCustomerByEstablishmentAction(establishmentId: bigint) {
    const repository = CustomerRepositoryFactory.create();
    const useCase = new FindAllCustomerByEstablishmentUseCase(repository);
    
    const result = await useCase.execute(establishmentId);
    
    return {
        ...result
    }
}