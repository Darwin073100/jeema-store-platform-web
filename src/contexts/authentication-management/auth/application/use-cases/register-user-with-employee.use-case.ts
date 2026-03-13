import { EncryptionRepository } from "src/contexts/authentication-management/auth/domain/repositories/encryption.repository";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserEmailVO } from "../../domain/value-objects/user.email.vo";
import { UserPasswordHashVO } from "../../domain/value-objects/user.password-hash.vo";
import { UserUsernameVO } from "../../domain/value-objects/user.username.vo";
import { UserRoleRepository } from "../../domain/repositories/user-role.repository";
import { UserRoleEntity } from "../../domain/entities/user-role.entity";
import { EmployeeEntity } from "src/contexts/employee-management/employee/domain/entities/employee.entity";
import { RegisterUserWithEmployeeDTO } from "../dtos/register-user-with-employee.dto";
import { BranchOfficeCheckerPort } from "src/contexts/establishment-management/branch-office/domain/ports/out/branch-office-checker.port";
import { UserNotFoundException } from "../../domain/exceptions/user-not-found.exception";
import { EmployeeRoleRepository } from "src/contexts/employee-management/employee-role/domain/repositories/employee-role.repository";
import { RoleRepository } from "src/contexts/authentication-management/role/domain/repositories/role.repository";

export class RegisterUserWithEmployeeUseCase{
    constructor(
        private readonly userRoleRepository: UserRoleRepository,
        private readonly branchOfficeCheckerPort: BranchOfficeCheckerPort,
        private readonly employeeRoleRepository: EmployeeRoleRepository,
        private readonly roleRepository: RoleRepository,
        private readonly encryptionRepository: EncryptionRepository,
    ){}

    async excecute(dto: RegisterUserWithEmployeeDTO):Promise<UserRoleEntity>{
       try {
         // Verificamos si la sucursal existe
        const branchOfficeExists = await this.branchOfficeCheckerPort.existById(dto.branchOfficeId);
        if(!branchOfficeExists){
            throw new UserNotFoundException(`Sucursal con id ${dto.branchOfficeId} no existe.`);
        }

        // Buscamos el rol de empleado por nombre
        const employeeRoleExist = await this.employeeRoleRepository.findByName('Gerente');
        if (!employeeRoleExist) {
            throw new UserNotFoundException(`Rol de empleado 'Gerente' no encontrado.`);
        }

        const roleExist = await this.roleRepository.findByName('establishment_manager');
        if(!roleExist){
            throw new UserNotFoundException(`Rol 'establishment_manager' no encontrado.`);
        }

        // Realizamos el hash de la contraseña en texto plano
        const hashedPassword = await this.encryptionRepository.encrypt(dto.passwordPlain);
        const usernameVO = UserUsernameVO.create(dto.username);
        const email = UserEmailVO.create(dto.email);
        const passwordHash = UserPasswordHashVO.create(hashedPassword);
        
        const employee = EmployeeEntity.create(
            employeeRoleExist.employeeRoleId,
            dto.branchOfficeId,
            null,
            dto.firstName,
            dto.lastName,
            dto.phoneNumber ?? null,
            dto.email,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
        );
        const user = UserEntity.createWithEmployee(
            BigInt(0),
            BigInt(0), 
            usernameVO,
            email,
            passwordHash,
            employee
        )
        const userRole = UserRoleEntity.createWithUser(BigInt(0), roleExist.roleId, user);

        const resp = await  this.userRoleRepository.save(userRole);

        return resp;
       } catch (error) {
        throw error;
       }
    }
}