import { BrandEntity } from '../../domain/entities/brand.entity';
import { IBrand } from '../../presentation/interfaces/Ibrand';
import { BrandResponseDto } from '../dtos/brand-response.dto';

export class BrandMapper {
  /**
   * Convierte una entidad de dominio Establishment a un DTO de respuesta.
   *
   * @param entity La entidad Establishment a mapear.
   * @returns Un EstablishmentResponseDto.
   */
  public static toResponseDto(entity: BrandEntity): BrandResponseDto {
    return new BrandResponseDto(
      entity.brandId.toString(), // Convertimos BigInt a string para la serialización JSON
      entity.name,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
    );
  }
  public static toIResponse(entity: BrandEntity): IBrand {
    const brand: IBrand = {
      brandId: entity.brandId, // Convertimos BigInt a string para la serialización JSON
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
    return brand;
  }
}