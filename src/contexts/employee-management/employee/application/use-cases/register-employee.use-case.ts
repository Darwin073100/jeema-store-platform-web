// src/contexts/educational-center-management/educational-center/application/use-cases/register-educational-center.use-case.ts

import { RegisterEmployeeDto } from '../dtos/register-employee.dto';
import { EmployeeRepository } from '../../domain/repositories/employee.repository';
import { EmployeeEntity } from '../../domain/entities/employee.entity';
import { GenderEnum } from '../../domain/enums/gender.enum';
import { EmployeeRoleChekerPort } from 'src/contexts/employee-management/employee-role/domain/ports/out/employee-role-checker.port';
import { BranchOfficeCheckerPort } from 'src/contexts/establishment-management/branch-office/domain/ports/out/branch-office-checker.port';
import { EmployeeNotFoundException } from '../../domain/exceptions/employee-not-found.exception';
import { TransactionDBRepository } from '@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository';
import { AddressEntity } from '@/contexts/establishment-management/address/domain/entities/address.entity';

/**
 * RegisterEstablishmentUseCase es un Caso de Uso (o Servicio de Aplicación).
 * Contiene la lógica de orquestación para el proceso de registro de un establesimiento.
 * No contiene lógica de negocio pura, sino que coordina a las entidades de dominio y repositorios.
 */
export class RegisterEmployeeRoleUseCase {
  constructor(
    // Inyectamos la interfaz del repositorio, no una implementación concreta.
    // Esto es Inversión de Dependencias.
    private readonly employeeRoleRepository: EmployeeRepository,
    private readonly employeeRoleCheckerPort: EmployeeRoleChekerPort,
    private readonly branchOfficeCheckerPort: BranchOfficeCheckerPort,
    private readonly transactionDBRepository: TransactionDBRepository,
  ) { }

  /**
   * Ejecuta el caso de uso para registrar un nuevo establesimiento.
   *
   * @param command El DTO que contiene los datos para el registro.
   * @returns Una Promesa que se resuelve con la entidad Establishment creada.
   * @throws Error si el nombre no es válido (validación del Value Object Name).
   */
  public async execute(command: RegisterEmployeeDto): Promise<EmployeeEntity> {
    try {
      this.transactionDBRepository.beginTransaction();
      // 0. Validar que el branch office y el employee role existen
      const branchOfficeExists = await this.branchOfficeCheckerPort.existById(command.branchOfficeId);
      const employeeRoleExists = await this.employeeRoleCheckerPort.exists(command.employeeRoleId);

      if (!branchOfficeExists) {
        throw new EmployeeNotFoundException(`La sucursal con el id ${command.branchOfficeId} no fue encontrada`);
      }

      if (!employeeRoleExists) {
        throw new EmployeeNotFoundException(`El rol de empleado con ID ${command.employeeRoleId} no fue encontrado`);
      }

      const address = command.address ? AddressEntity.create(
        command.address.country,
        command.address.state,
        command.address.postalCode,
        command.address.municipality,
        command.address.city,
        command.address.street ?? null,
        command.address.externalNumber ?? null,
        command.address.internalNumber ?? null,
        command.address.neighborhood ?? null,
        command.address.reference ?? null,
      ) : null;

      const employee = EmployeeEntity.create(
        command.employeeRoleId,
        command.branchOfficeId,
        null, // addressId se asignará tras persistir (cascade)
        command.firstName,
        command.lastName,
        command.phoneNumber,
        command.email,
        command.birthDate? new Date(command.birthDate): null,
        command.gender? command.gender as GenderEnum: null,
        command.hireDate? new Date(command.hireDate): null,
        command.terminationDate? new Date(command.terminationDate): null,
        command.entryTime,
        command.exitTime,
        command.photoUrl,
        command.currentSalary,
      );

      // Asignar address en memoria (cascade)
      (employee as any)._address = address;

      const savedEntity = await this.employeeRoleRepository.save(employee);

      this.transactionDBRepository.commit();
      return savedEntity;
    } catch (error) {
      this.transactionDBRepository.rollback();
      throw error;
    }
  }
}