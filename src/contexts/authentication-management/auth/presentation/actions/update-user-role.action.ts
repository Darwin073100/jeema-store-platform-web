'use server'
import { revalidatePath } from "next/cache";
import { UpdateUserRoleDTO } from "../../application/dtos/update-user-role.dto";
import { UpdateUserRoleUseCase } from "../../application/use-cases/update-user-role.use-case";
import { TypeormUserRoleRepository } from "../../infraestructure/repositories/typeorm-user-role.repository";
import { TypeormRoleRepository } from "@/contexts/authentication-management/role/infraestructure/persistence/typeorm/repositories/typeorm-role.repository";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/features/result";
import { UserRoleMapper } from "../../application/mapper/user-role.mapper";

export async function updateUserRoleAction(dto: UpdateUserRoleDTO) {
    try {
        const userRoleRepository = await TypeormUserRoleRepository.create();
        const roleRepository = await TypeormRoleRepository.create();
        const useCase = new UpdateUserRoleUseCase(userRoleRepository, roleRepository);

        const result = await useCase.excecute(dto);

        revalidatePath('/configurations/employees');
        revalidatePath('/configurations/users');

        return {
            ...Result.success(UserRoleMapper.toIResponse(result))
        }
    }catch(error){
        return {
            ...handleError(error, 'updateUserRoleAction')
        }
    }
}