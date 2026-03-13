import { RoleEntity } from "../../domain/entities/role-entity";
import { RoleResponseDto } from "../dtos/role-response.dto";

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
}
