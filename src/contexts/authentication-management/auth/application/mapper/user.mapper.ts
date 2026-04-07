import { PermissionEntity } from "src/contexts/authentication-management/permission/domain/entities/permission-entity";
import { UserRoleEntity } from "../../domain/entities/user-role.entity";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserProfileResponse } from "../dtos/user-profile-response";
import { UserRegisterResponseDTO } from "../dtos/user-register-response.dto";
import { IUserWorkspace } from "../dtos/IUserWorkspace";
import { UserResponseDTO } from "../dtos/user-response.dto";
import { EmployeeMapper } from "src/contexts/employee-management/employee/application/mappers/employee.mapper";
import { UserRoleMapper } from "./user-role.mapper";
import { IUser } from "../../presentation/interfaces/IUser";

export class UserMapper{
    /**
     * Este metodo se usa para convertir una entidad de dominio a una respuesta HTTP para los endpoinds.
     * @param entity UserEntity
     * @returns UserResponseDTO
     */
    static toResponseDTO(entity: UserRoleEntity):UserRegisterResponseDTO{
        const responseDTO = new UserRegisterResponseDTO(
            entity.userId,
            entity.user?.employeeId,
            entity.user?.username.value,
            entity.user?.email.value,
            {
                roleId: entity.role?.roleId,
                name: entity.role?.name.name,
                description: entity.role?.description?.description,
                createdAt: entity.role?.createdAt,
                updatedAt: entity.role?.updatedAt,
                deletedAt: entity.role?.deletedAt
            },
            entity.user?.isActive,
            entity.user?.createdAt,
            entity.user?.lastLogin,
            entity.user?.updatedAt,
            entity.user?.deletedAt
        );
        return responseDTO;
    }

    static toProfileResponse(entity: UserEntity): UserProfileResponse{
        const profile: UserProfileResponse = {
            user:{
                email: entity.email?.value || '',
                employeeId: entity.employeeId,
                // permissions: entity.userRoles?.flatMap((ur:UserRoleEntity) => ur.role?.rolePermissions?.map(rp => rp.permission.name)) || [],
                permissions: entity.userRoles?.flatMap((ur:UserRoleEntity) => ur.role?.rolePermissions) || [],
                roles: entity.userRoles?.map(ur => ur.role?.name.name ?? '') ?? [],
                userId: entity.userId,
                username: entity.username?.value || ''
            },
            employee: entity.employee ? {
                employeeId: entity.employee.employeeId,
                firstName: entity.employee.firstName,
                lastName: entity.employee.lastName,
                email: entity.employee.email ?? '',
                phoneNumber: entity.employee.phoneNumber ?? '',
                branchOfficeId: entity.employee.branchOfficeId,
                employeeRoleId: entity.employee.employeeRoleId
            } : undefined,
        }

        return profile;
    }
    static toResponseUserDTO(entity: UserEntity){
        const profile: UserResponseDTO = {
            userId: entity.userId.toString(),
            employeeId: entity.employeeId.toString(),
            email: entity.email?.value || '',
            username: entity.username?.value || '',
            isActive: entity.isActive,
            passwordHash: entity.passwordHash.value,
            employee: entity.employee? EmployeeMapper.toResponseDto(entity.employee): null,
            userRoles: entity.userRoles? entity.userRoles?.map(item => UserRoleMapper.toResponse(item)): [],
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt,
        }
        return profile;
    }
    static toIResponse(entity: UserEntity){
        const profile: IUser = {
            userId: entity.userId,
            employeeId: entity.employeeId,
            email: entity.email?.value || '',
            username: entity.username?.value || '',
            isActive: entity.isActive,
            lastLogin: entity.lastLogin ?? null,
            passwordHash: entity.passwordHash.value,
            employee: entity.employee? EmployeeMapper.toIResponse(entity.employee): null,
            userRoles: entity.userRoles? entity.userRoles?.map(item => UserRoleMapper.toIResponse(item)): [],
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt ?? null,
            deletedAt: entity.deletedAt ?? null,
        }
        return profile;
    }
    static toIUserWorkspace(entity: UserEntity): IUserWorkspace{
        const profile = UserMapper.toIResponse(entity);
        return {
            user: profile,
            employee: profile?.employee ?? null,
            branchOffice: profile.employee?.branchOffice ?? null,
            establishment: profile.employee?.branchOffice?.establishment ?? null
        }
    }
}