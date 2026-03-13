import { PermissionEntity } from "../../domain/entities/permission-entity";
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
}
