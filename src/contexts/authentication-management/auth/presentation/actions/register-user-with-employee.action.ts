'use server'
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { RegisterUserWithEmployeeDTO } from "../../application/dtos/register-user-with-employee.dto";
import { RegisterUserWithEmployeeUseCase } from "../../application/use-cases/register-user-with-employee.use-case";
import { TypeormUserRoleRepository } from "../../infraestructure/repositories/typeorm-user-role.repository";
import { TypeOrmEmployeeRoleRepository } from "@/contexts/employee-management/employee-role/infraestruture/persistence/typeorm/repositories/typeorm-employee-role.repository";
import { TypeormRoleRepository } from "@/contexts/authentication-management/role/infraestructure/persistence/typeorm/repositories/typeorm-role.repository";
import { BcryptEncryptionRepository } from "../../infraestructure/encryption/bcrypt.encryption.repository";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/features/result";
import { UserRoleMapper } from "../../application/mapper/user-role.mapper";

export async function registerUserWithEmployeeAction(dto: RegisterUserWithEmployeeDTO) {
    try {
        const userRoleRepository = await TypeormUserRoleRepository.create();
        const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();
        const employeeRoleRepository = await TypeOrmEmployeeRoleRepository.create();
        const roleRepository = await TypeormRoleRepository.create();
        const encryptionRepository = await BcryptEncryptionRepository.create();
        const registerUserWithEmployeeUseCase = new RegisterUserWithEmployeeUseCase(
            userRoleRepository, branchOfficeRepository, employeeRoleRepository, roleRepository, encryptionRepository
        );

        const result = await registerUserWithEmployeeUseCase.excecute(dto);

        return {
            ...Result.success(UserRoleMapper.toIResponse(result))
        }
    }catch(error){
        return {
            ...handleError(error, 'registerUserWithEmployeeAction')
        }
    }
}