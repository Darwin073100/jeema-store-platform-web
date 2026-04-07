import { PermissionMapper } from "@/contexts/authentication-management/permission/application/mappers/permission-mapper";
import { RolePermissionEntity } from "../../domain/entities/role-permission.entity";
import { IRolePermission } from "../../presentation/interfaces/IRolePermission";
import { RolePermissionResponseDTO } from "../dtos/role-permission-response.dto";
import { RoleMapper } from "./role.mapper";

export class RolePermissionMapper {
  /**
   * Convierte una entidad de dominio RolePermission a un DTO de respuesta.
   *
   * @param entity La entidad RolePermission a mapear.
   * @returns Un RolePermissionResponseDto.
   */
  public static toResponseDto(entity: RolePermissionEntity): RolePermissionResponseDTO {
    return new RolePermissionResponseDTO(
      entity?.role?.roleId, // Convertimos BigInt a string para la serialización JSON
      entity?.role?.name.name,
      entity?.role?.description?.description,
      {
        permissionId: entity.permission?.permissionId,
        name: entity.permission?.name.name,
        description: entity.permission?.description?.description,
        createdAt: entity.permission?.createdAt,
        updatedAt: entity.permission?.updatedAt,
        deletedAt: entity.permission?.deletedAt,
      },
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
    );
  }
  public static toIResponse(entity: RolePermissionEntity): IRolePermission {
    return {
      rolePermissionId: entity.rolePermissionId,
      permissionId: entity.permissionId,
      roleId: entity.roleId,
      role: entity.role? RoleMapper.toIResponse(entity.role): null,
      permission: entity.permission? PermissionMapper.toIResponse(entity.permission): null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt ?? null,
      deletedAt: entity.deletedAt ?? null
    }
  }
}