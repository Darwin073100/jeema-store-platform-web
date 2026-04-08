'use server'
import { revalidatePath } from "next/cache";
import { DeleteUserRoleUseCase } from "../../application/use-cases/delete-user-role.use-case";
import { TypeormUserRoleRepository } from "../../infraestructure/repositories/typeorm-user-role.repository";
import { Result } from "@/shared/lib/utils/result";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

export async function deleteUserRoleAction(userRoleId: bigint) {
    try{
        const userFetchRepositoryImpl = await TypeormUserRoleRepository.create();
    const useCase = new DeleteUserRoleUseCase(userFetchRepositoryImpl);

    await useCase.excecute(userRoleId);
    
    revalidatePath('/configurations/employees');
    revalidatePath('/configurations/users');

    return {
        ...Result.success({})
    }
    }catch(error){
        return {
            ...handleError(error, 'deleteUserRoleAction')
        }
    }
}