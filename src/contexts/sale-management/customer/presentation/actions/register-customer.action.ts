'use server';
import { cookies } from "next/headers";
import { IEstablishment } from "@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment";
import { RegisterCustomerDto } from "../../application/dtos/register-customer.dto";
import { TypeOrmCustomerRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-customer.repository";
import { RegisterCustomerUseCase } from "../../application/use-cases/register-customer.use-case";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/features/result";
import { CustomerMapper } from "../../application/mappers/customer.mapper";

export async function registerCustomerAction(dto: Omit<RegisterCustomerDto, 'establishmentId'>) {
    try {
        const repository = await TypeOrmCustomerRepository.create();
        const useCase = new RegisterCustomerUseCase(repository);
        const cookieStore = await cookies();

        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as IEstablishment).establishmentId;
        }

        const currentDTO = {
            ...dto,
            establishmentId: establishmentId
        }

        const result = await useCase.execute(currentDTO);

        return {
            ...Result.success(CustomerMapper.toIResponse(result))
        }
    }catch(error){
        console.error('registerCustomerAction', error);
        return {
            ...handleError(error, 'registerCustomerAction')
        }
    }
}