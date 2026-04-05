'use server'
import { revalidatePath } from "next/cache";
import { UserRepositoryFactory } from "../../../../../features/auth/infraestructure/factories/user-repository.factory";
import { AddRoleToUserUseCase } from "../../../../../features/auth/application/use-cases/add-role-to-user.use-case";
import { AddRoleToUserDTO } from "../../../../../features/auth/application/dtos/add-role-to-user.dto";

export async function addRoleToUserAction(dto: AddRoleToUserDTO) {
    const userFetchRepositoryImpl = UserRepositoryFactory.create();
    const useCase = new AddRoleToUserUseCase(userFetchRepositoryImpl);

    const result = await useCase.execute(dto);
    
    if (result.ok) {
        revalidatePath('/configurations/employees');
        revalidatePath('/configurations/users');
    }

    return {
        ...result
    }
}