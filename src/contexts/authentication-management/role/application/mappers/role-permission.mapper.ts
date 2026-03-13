import { RolePermissionEntity } from "../../domain/entities/role-permission.entity";
import { RolePermissionResponseDTO } from "../dtos/role-permission-response.dto";

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
}