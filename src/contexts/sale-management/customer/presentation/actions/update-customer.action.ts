'use server';
import { TypeOrmCustomerRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-customer.repository";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/lib/utils/result";
import { CustomerMapper } from "../../application/mappers/customer.mapper";
import { UpdateCustomerDto } from "../../application/dtos/update-customer.dto";
import { UpdateCustomerUseCase } from "../../application/use-cases/update-customer.use-case";
import { revalidatePath } from "next/cache";

export async function updateCustomerAction(dto: UpdateCustomerDto) {
    try {
        const repository = await TypeOrmCustomerRepository.create();
        const useCase = new UpdateCustomerUseCase(repository);

        const result = await useCase.execute(dto);

        revalidatePath('/customers');

        return {
            ...Result.success(CustomerMapper.toIResponse(result))
        }
    }catch(error){
        return {
            ...handleError(error, 'updateCustomerAction')
        }
    }
}