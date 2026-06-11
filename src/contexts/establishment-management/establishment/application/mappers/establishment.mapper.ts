// src/contexts/educational-center-management/educational-center/application/mappers/educational-center.mapper.ts

import { BranchOfficeMapper } from 'src/contexts/establishment-management/branch-office/application/mappers/branch-office.mapper';
import { EstablishmentEntity } from '../../domain/entities/establishment.entity';
import { EstablishmentResponseDto } from '../dtos/establishment-response.dto';
import { IEstablishment } from '../../presentation/interfaces/IEstablishment';

/**
 * EstablishmentMapper es una clase que se encarga de transformar
 * la entidad de dominio Establishment en un DTO de respuesta
 * apto para la capa de presentación.
 *
 * Los mappers son esenciales para evitar que la capa de presentación
 * dependa directamente de los objetos de dominio.
 */
export class EstablishmentMapper {
  /**
   * Convierte una entidad de dominio Establishment a un DTO de respuesta.
   *
   * @param entity La entidad Establishment a mapear.
   * @returns Un EstablishmentResponseDto.
   */
  public static toResponseDto(entity: EstablishmentEntity): EstablishmentResponseDto {
    return new EstablishmentResponseDto(
      entity.establishmentId.toString(), // Convertimos BigInt a string para la serialización JSON
      entity.name,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
      entity.branchOffices? entity.branchOffices.map(item => BranchOfficeMapper.toResponseDto(item)): []
    );
  }
  public static toIResponse(entity: EstablishmentEntity): IEstablishment {
    const establishment: IEstablishment = {
      establishmentId: entity.establishmentId, // Convertimos BigInt a string para la serialización JSON
      enrollmentKey: entity.enrollmentKey,
      cloudEstablishmentId: entity.cloudEstablishmentId,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
      branchOffices: entity.branchOffices? entity.branchOffices.map(item => BranchOfficeMapper.toIResponse(item)): []
    };
    return establishment;
  }
}