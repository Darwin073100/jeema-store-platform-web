'use server'
import { revalidatePath } from "next/cache";
import { UserRepositoryFactory } from "../../../../../features/auth/infraestructure/factories/user-repository.factory";
import { DeleteUserRoleUseCase } from "../../../../../features/auth/application/use-cases/delete-user-role.use-case";

export async function deleteUserRoleAction(userRoleId: bigint) {
    const userFetchRepositoryImpl = UserRepositoryFactory.create();
    const useCase = new DeleteUserRoleUseCase(userFetchRepositoryImpl);

    const result = await useCase.execute(userRoleId);
    
    if (result.ok) {
        revalidatePath('/configurations/employees');
        revalidatePath('/configurations/users');
    }

    return {
        ...result
    }
}