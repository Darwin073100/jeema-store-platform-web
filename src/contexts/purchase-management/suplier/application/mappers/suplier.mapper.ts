import { AddressMapper } from "src/shared/application/mappers/address.mapper";
import { SuplierEntity } from "../../domain/entities/suplier.entity";
import { SuplierResponseDto } from "../dtos/suplier-response.dto";

/**
 * BranchOfficeMapper es una clase que se encarga de transformar
 * la entidad de dominio BranchOffice en un DTO de respuesta
 * apto para la capa de presentación.
 *
 * Los mappers son esenciales para evitar que la capa de presentación
 * dependa directamente de los objetos de dominio.
 */
export class SuplierMapper {
    /**
     * Convierte una entidad de dominio BranchOffice a un DTO de respuesta.
     *
     * @param entity La entidad BranchOffice a mapear.
     * @returns Un BranchOfficeResponseDto.
     */
    public static toResponseDto(entity: SuplierEntity): SuplierResponseDto {
      return new SuplierResponseDto(
        entity.suplierId,
        entity.name,
        entity.phoneNumber,
        entity.address? AddressMapper.toResponseDTO(entity.address): null,
        entity.createdAt,
        entity.rfc,
        entity.contactPerson,
        entity.email,
        entity.notes,
        entity.updatedAt,
        entity.deletedAt,
      );
    }
}