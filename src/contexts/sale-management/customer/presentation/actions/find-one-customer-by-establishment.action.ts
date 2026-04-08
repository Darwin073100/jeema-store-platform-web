'use server';
import { cookies } from "next/headers";
import { TypeOrmCustomerRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-customer.repository";
import { FindOneCustomerByEstablishmentUseCase } from "../../application/use-cases/find-one-customer-by-establishment.use-case";
import { IEstablishment } from "@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment";
import { EstablishmentNotFoundException } from "@/contexts/establishment-management/establishment/domain/exceptions/establishment-not-found.exception";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/lib/utils/result";
import { CustomerMapper } from "../../application/mappers/customer.mapper";

export async function findOneCustomerByEstablishmentAction(customerId: bigint) {
    try{
        const repository = await TypeOrmCustomerRepository.create();
    const useCase = new FindOneCustomerByEstablishmentUseCase(repository);
    const cookieStore = await cookies();
    let establishment;

    if(cookieStore.has('establishmentCookie')){
        establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        if(establishment){
            establishment = JSON.parse(establishment) as IEstablishment;
            const result = await useCase.execute(customerId, establishment.establishmentId);
            return {
                ...Result.success(CustomerMapper.toIResponse(result))
            }
        }
    } else {
        throw new EstablishmentNotFoundException('Hubo problemas en el servidor cli.');
    }
    }catch(error){
        console.error('findOneCustomerByEstablishmentAction', error);
        return {
            ...handleError(error, 'findOneCustomerByEstablishmentAction')
        }
    }
}