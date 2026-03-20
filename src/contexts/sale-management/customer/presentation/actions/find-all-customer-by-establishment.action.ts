'use server';
import { cookies } from "next/headers";
import { IEstablishment } from "@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment";
import { TypeOrmCustomerRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-customer.repository";
import { FindAllCustomerByEstablishmentUseCase } from "../../application/use-cases/find-all-customer-by-establishment.use-case";
import { Result } from "@/shared/features/result";
import { CustomerMapper } from "../../application/mappers/customer.mapper";
import { CustomerNotFountException } from "../../domain/exceptions/customer-not-found.exception";

export async function findAllCustomerByEstablishmentAction() {
    try {
        const repository = await TypeOrmCustomerRepository.create();
        const useCase = new FindAllCustomerByEstablishmentUseCase(repository);
        const cookieStore = await cookies();
        let establishment;

        if (cookieStore.has('establishmentCookie')) {
            establishment = cookieStore.get('establishmentCookie')?.value ?? null;
            if (establishment) {
                establishment = JSON.parse(establishment) as IEstablishment;
                const result = await useCase.execute(establishment.establishmentId);
                return {
                    ...Result.success({ customers: result.map(item => CustomerMapper.toIResponse(item)) })
                }
            }
        } else {
            throw new CustomerNotFountException('No pudimos optener la lista de clientes.');
        }
    } catch(error) {
        console.error('findAllCustomerByEstablishmentAction: ', error);
        return {
            ...Result.success({customers: []})
        }
    }
}