'use server'
import { revalidatePath } from "next/cache";
import { AddRoleToUserDTO } from "../../application/dtos/add-role-to-user.dto";
import { TyperomUserRepository } from "../../infraestructure/repositories/typeorm-user.repository";
import { AddRoleToUserUseCase } from "../../application/use-cases/add-role-to-user.use-case";
import { TypeormUserRoleRepository } from "../../infraestructure/repositories/typeorm-user-role.repository";
import { TypeormRoleRepository } from "@/contexts/authentication-management/role/infraestructure/persistence/typeorm/repositories/typeorm-role.repository";
import { Result } from "@/shared/features/result";
import { UserRoleMapper } from "../../application/mapper/user-role.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

export async function addRoleToUserAction(dto: AddRoleToUserDTO) {
    try{
    const userRoleRepository = await TypeormUserRoleRepository.create();
    const userRepository = await TyperomUserRepository.create();
    const roleRepository = await TypeormRoleRepository.create();
    const useCase = new AddRoleToUserUseCase(userRoleRepository, userRepository, roleRepository);

    const result = await useCase.excecute(dto);
    
    revalidatePath('/configurations/employees');
    revalidatePath('/configurations/users');

    return {
        ...Result.success(UserRoleMapper.toIResponse(result))
    }
    }catch(error){
        return {
            ...handleError(error, 'addRoleToUserAction')
        }
    }
}