import { CategoryEntity } from "../../domain/entities/category-entity";
import { CategoryResponseDto } from "../dtos/category-response.dto";

export class CategoryMapper {
  /**
   * Convierte una entidad de dominio Category a un DTO de respuesta.
   *
   * @param entity La entidad Category a mapear.
   * @returns Un CategoryResponseDto.
   */
  public static toResponseDto(entity: CategoryEntity): CategoryResponseDto {
    return new CategoryResponseDto(
      entity.categoryId.toString(), // Convertimos BigInt a string para la serialización JSON
      entity.name,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
      entity.description ?? null,
    );
  }
}
