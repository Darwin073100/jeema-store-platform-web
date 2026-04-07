import { UserRoleMapper } from "@/contexts/authentication-management/auth/application/mapper/user-role.mapper";
import { RoleEntity } from "../../domain/entities/role-entity";
import { IRole } from "../../presentation/interfaces/IRole";
import { RoleResponseDto } from "../dtos/role-response.dto";
import { RolePermissionMapper } from "./role-permission.mapper";

export class RoleMapper {
  /**
   * Convierte una entidad de dominio Category a un DTO de respuesta.
   *
   * @param entity La entidad Category a mapear.
   * @returns Un CategoryResponseDto.
   */
  public static toResponseDto(entity: RoleEntity): RoleResponseDto {
    return new RoleResponseDto(
      entity.roleId.toString(), // Convertimos BigInt a string para la serialización JSON
      entity.name.name,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
      entity.description?.description,
    );
  }
  public static toIResponse(entity: RoleEntity): IRole {
    return {
      roleId: entity.roleId, // Convertimos BigInt a string para la serialización JSON
      name: entity.name.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
      description: entity.description?.description ?? null,
      rolePermissions: entity.rolePermissions? entity.rolePermissions.map(item => RolePermissionMapper.toIResponse(item)): [],
      userRoles: entity.userRoles? entity.userRoles.map(item => UserRoleMapper.toIResponse(item)): []
    };
  }
}
