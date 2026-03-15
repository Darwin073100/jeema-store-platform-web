import { CategoryEntity } from "../../domain/entities/category-entity";
import { ICategory } from "../../presentation/interfaces/ICategory";
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
  public static toIResponse(entity: CategoryEntity): ICategory {
    const category: ICategory = {
      categoryId: entity.categoryId, // Convertimos BigInt a string para la serialización JSON
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
      description: entity.description ?? null,
    };
    return category;
  }
}
