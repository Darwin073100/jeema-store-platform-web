'use server';
import { cookies } from "next/headers";
import { CustomerRepositoryFactory } from "../infraestructure/factory/customer-repository.factory";
import { EstablishmentEntity } from "@/features/establishment/domain/entities/establishment.entity";
import { RegisterCustomerUseCase } from "../application/use-cases/register-customer.use-case";
import { RegisterCustomerDTO } from "../application/dtos/register-customer.dto";

export async function registerCustomerAction(dto: Omit<RegisterCustomerDTO, 'establishmentId'>) {
    const repository = CustomerRepositoryFactory.create();
    const useCase = new RegisterCustomerUseCase(repository);
    const cookieStore = await cookies();
    
    let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
    let establishmentId = BigInt(0);
    if (establishment) {
        establishmentId = (JSON.parse(establishment) as EstablishmentEntity).establishmentId;
    }

    const currentDTO = {
        ...dto,
        establishmentId: establishmentId
    }

    const result = await useCase.execute(currentDTO);

    return {
        ...result
    }
}