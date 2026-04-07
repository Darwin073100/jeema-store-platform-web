import { RolePermissionMapper } from "@/contexts/authentication-management/role/application/mappers/role-permission.mapper";
import { PermissionEntity } from "../../domain/entities/permission-entity";
import { IPermission } from "../../presentation/interfaces/IPermission";
import { PermissionResponseDto } from "../dtos/permission-response.dto";

export class PermissionMapper {
  /**
   * Convierte una entidad de dominio Permission a un DTO de respuesta.
   *
   * @param entity La entidad Permission a mapear.
   * @returns Un PermissionResponseDto.
   */
  public static toResponseDto(entity: PermissionEntity): PermissionResponseDto {
    return new PermissionResponseDto(
      entity.permissionId.toString(), // Convertimos BigInt a string para la serialización JSON
      entity.name.name,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
      entity.description?.description,
    );
  }
  public static toIResponse(entity: PermissionEntity): IPermission {
    return {
      permissionId: entity.permissionId,
      name: entity.name.name,
      description: entity.description?.description ?? null,
      rolePermissions: entity.rolePermissions? entity.rolePermissions.map(item => RolePermissionMapper.toIResponse(item)): [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    }
  }
}
