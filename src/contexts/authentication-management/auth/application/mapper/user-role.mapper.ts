import { RoleMapper } from "src/contexts/authentication-management/role/application/mappers/role.mapper";
import { UserRoleEntity } from "../../domain/entities/user-role.entity";
import { UserRoleResponseDTO } from "../dtos/user-role-response.dto";
import { UserMapper } from "./user.mapper";

export class UserRoleMapper {
    static toResponse(entity: UserRoleEntity): UserRoleResponseDTO{
        const response: UserRoleResponseDTO = {
            userRoleId: entity.userRoleId.toString(),
            userId: entity.userId.toString(),
            roleId: entity.roleId.toString(),
            role: entity?.role ? RoleMapper.toResponseDto(entity.role): null,
            user: entity?.user ? UserMapper.toResponseUserDTO(entity.user): null,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt ?? null,
            deletedAt: entity.deletedAt ?? null
        }
        return response;
    }
}