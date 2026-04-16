'use server'
import { Result } from "@/shared/lib/utils/result";
import { AddressMapper } from "../../application/mappers/address.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { TypeormAddressRepository } from "../../infraestructure/infraestructure/typeorm-address.repository";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";
import { revalidatePath } from "next/cache";
import { UpdateAddressUseCase } from "../../application/use-cases/update-address.use-case";
import { UpdateAddressMany } from "../../application/dtos/update-address-many.dto";

export async function updateAddressAction(dto: UpdateAddressMany) {
    try {
        const addressRepository = await TypeormAddressRepository.create();
        const transaction = await TypeormTransactionDBRepository.create();

        const useCase = new UpdateAddressUseCase(
            addressRepository, transaction
        );

        const result = await useCase.execute(dto);
        
        if(dto.branchOfficeId){
            revalidatePath('/');
        }
        if(dto.employeeId){
            revalidatePath('/configurations');
        }
        if(dto.suplierId){
            revalidatePath('/purchases');
        }
        if(dto.customerId){
            revalidatePath('/customers');
        }

        return {
            ...Result.success(AddressMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error, 'updateAddressAction')
        }
    }
}