import { BrandEntity } from '../../domain/entities/brand.entity';
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
}