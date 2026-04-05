'use server'
import { revalidatePath } from "next/cache";
import { UserRepositoryFactory } from "../../../../../features/auth/infraestructure/factories/user-repository.factory";
import { UpdateUserRoleDTO } from "../../../../../features/auth/application/dtos/update-user-role.dto";
import { UpdateUserRoleUseCase } from "../../../../../features/auth/application/use-cases/update-user-role.use-case";

export async function updateUserRoleAction(dto: UpdateUserRoleDTO) {
    const userFetchRepositoryImpl = UserRepositoryFactory.create();
    const useCase = new UpdateUserRoleUseCase(userFetchRepositoryImpl);

    const result = await useCase.execute(dto);
    
    if (result.ok) {
        revalidatePath('/configurations/employees');
        revalidatePath('/configurations/users');
    }

    return {
        ...result
    }
}