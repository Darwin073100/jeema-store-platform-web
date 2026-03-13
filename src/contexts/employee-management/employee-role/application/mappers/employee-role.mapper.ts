// src/contexts/educational-center-management/educational-center/application/mappers/educational-center.mapper.ts

import { EmployeeRoleEntity } from '../../domain/entities/employee-role.entity';
import { EmployeeRoleResponseDto } from '../dtos/employee-role-response.dto';

/**
 * EstablishmentMapper es una clase que se encarga de transformar
 * la entidad de dominio Establishment en un DTO de respuesta
 * apto para la capa de presentación.
 *
 * Los mappers son esenciales para evitar que la capa de presentación
 * dependa directamente de los objetos de dominio.
 */
export class EmployeeRoleMapper {
  /**
   * Convierte una entidad de dominio Establishment a un DTO de respuesta.
   *
   * @param entity La entidad Establishment a mapear.
   * @returns Un EstablishmentResponseDto.
   */
  public static toResponseDto(entity: EmployeeRoleEntity): EmployeeRoleResponseDto {
    return new EmployeeRoleResponseDto(
      entity.employeeRoleId.toString(), // Convertimos BigInt a string para la serialización JSON
      entity.name.value,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
    );
  }
}