// src/contexts/educational-center-management/educational-center/application/mappers/educational-center.mapper.ts

import { EmployeeRoleMapper } from 'src/contexts/employee-management/employee-role/application/mappers/employee-role.mapper';
import { EmployeeEntity } from '../../domain/entities/employee.entity';
import { EmployeeResponseDto } from '../dtos/employee-response.dto';
import { AddressMapper } from 'src/shared/application/mappers/address.mapper';
import { UserMapper } from 'src/contexts/authentication-management/auth/application/mapper/user.mapper';

/**
 * EstablishmentMapper es una clase que se encarga de transformar
 * la entidad de dominio Establishment en un DTO de respuesta
 * apto para la capa de presentación.
 *
 * Los mappers son esenciales para evitar que la capa de presentación
 * dependa directamente de los objetos de dominio.
 */
export class EmployeeMapper {
  /**
   * Convierte una entidad de dominio Establishment a un DTO de respuesta.
   *
   * @param entity La entidad Establishment a mapear.
   * @returns Un EstablishmentResponseDto.
   */
  public static toResponseDto(entity: EmployeeEntity): EmployeeResponseDto {
    return new EmployeeResponseDto(
      entity.employeeId?.toString(),
      entity.branchOfficeId?.toString(),
      entity.employeeRoleId?.toString(),
      entity.addressId ? entity.addressId.toString() : null,
      entity.firstName,
      entity.lastName,
      entity.email,
      entity.createdAt,
      entity.phoneNumber,
      entity.birthDate,
      entity.gender,
      entity.hireDate,
      entity.terminationDate,
      entity.entryTime,
      entity.exitTime,
      entity.currentSalary,
      entity.isActive,
      entity.photoUrl,
      entity.updatedAt,
      entity.deletedAt,
      entity.employeeRole? EmployeeRoleMapper.toResponseDto(entity.employeeRole): null,
      entity.address? AddressMapper.toResponseDTO(entity.address) : null,
      entity.user? {...UserMapper.toResponseUserDTO(entity.user), passwordHash: ''}: null
    );
  }
}