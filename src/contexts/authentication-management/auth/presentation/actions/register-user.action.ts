'use server'
import { revalidatePath } from "next/cache";
import { RegisterUserDTO } from "../../application/dtos/register-user.dto";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case";
import { TypeormUserRoleRepository } from "../../infraestructure/repositories/typeorm-user-role.repository";
import { BcryptEncryptionRepository } from "../../infraestructure/encryption/bcrypt.encryption.repository";
import { TypeormRoleRepository } from "@/contexts/authentication-management/role/infraestructure/persistence/typeorm/repositories/typeorm-role.repository";
import { TypeOrmEmployeeRepository } from "@/contexts/employee-management/employee/infraestruture/persistence/typeorm/repositories/typeorm-employee.repository";
import { Result } from "@/shared/features/result";
import { UserRoleMapper } from "../../application/mapper/user-role.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

export async function registerUserAction(dto: RegisterUserDTO) {
    try {
        const userRoleRepository = await TypeormUserRoleRepository.create();
        const roleRepository = await TypeormRoleRepository.create();
        const employeeRepository = await TypeOrmEmployeeRepository.create();
        const bcryptRepository = await BcryptEncryptionRepository.create();
        const useCase = new RegisterUserUseCase(roleRepository, employeeRepository, userRoleRepository, bcryptRepository);

        const result = await useCase.excecute(dto);

        revalidatePath('/configurations/employees');
        revalidatePath('/configurations/users');

        return {
            ...Result.success(UserRoleMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error, 'registerUserAction')
        }
    }
}