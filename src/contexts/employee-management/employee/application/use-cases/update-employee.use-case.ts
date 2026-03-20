import { EmployeeRepository } from '../../domain/repositories/employee.repository';
import { EmployeeEntity } from '../../domain/entities/employee.entity';
import { GenderEnum } from '../../domain/enums/gender.enum';
import { EmployeeNotFoundException } from '../../domain/exceptions/employee-not-found.exception';
import { UpdateEmployeeDto } from '../dtos/update-employee.dto';
import { EmployeeRoleRepository } from '@/contexts/employee-management/employee-role/domain/repositories/employee-role.repository';
import { BranchOfficeRepository } from '@/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository';

/**
 * RegisterEstablishmentUseCase es un Caso de Uso (o Servicio de Aplicación).
 * Contiene la lógica de orquestación para el proceso de registro de un establesimiento.
 * No contiene lógica de negocio pura, sino que coordina a las entidades de dominio y repositorios.
 */
export class UpdateEmployeeUseCase {
  constructor(
    // Inyectamos la interfaz del repositorio, no una implementación concreta.
    // Esto es Inversión de Dependencias.
    private readonly employeeRepository: EmployeeRepository,
    private readonly employeeRoleCheckerPort: EmployeeRoleRepository,
    private readonly branchOfficeCheckerPort: BranchOfficeRepository,
  ) { }

  /**
   * Ejecuta el caso de uso para registrar un nuevo establesimiento.
   *
   * @param command El DTO que contiene los datos para el registro.
   * @returns Una Promesa que se resuelve con la entidad Establishment creada.
   * @throws Error si el nombre no es válido (validación del Value Object Name).
   */
  public async execute(employeeId: bigint, command: UpdateEmployeeDto): Promise<EmployeeEntity> {
    try {
      const employee = await this.employeeRepository.findById(employeeId);
      if(!employee){
        throw new EmployeeNotFoundException(`El empleado con ID ${employeeId} no fue encontrado`);
      }

      if(command.firstName){
        employee.updateFirstName(command.firstName);
      }
      if(command.lastName){
        employee.updateLastName(command.lastName);
      }
      if(command.branchOfficeId){
        const branchOfficeExists = await this.branchOfficeCheckerPort.existById(command.branchOfficeId);
        if (!branchOfficeExists) {
          throw new EmployeeNotFoundException(`La sucursal con el id ${command.branchOfficeId} no fue encontrada`);
        }
        employee.updateBranchOfficeId(command.branchOfficeId);
      }
      if(command.employeeRoleId){
        const employeeRoleExists = await this.employeeRoleCheckerPort.existById(command.employeeRoleId);
        if (!employeeRoleExists) {
          throw new EmployeeNotFoundException(`El rol de empleado con ID ${command.employeeRoleId} no fue encontrado`);
        }
        employee.updateEmployeeRoleId(command.employeeRoleId);
      }
      if(command.phoneNumber){
        employee.updatePhoneNumber(command.phoneNumber);
      }
      if(command.email !== undefined){
        employee.updateEmail(command.email ?? null);
      }
      if(command.birthDate !== undefined){
        employee.updateBirthDate(command.birthDate? new Date(command.birthDate): null);
      }
      if(command.gender !== undefined){
        employee.updateGender(command.gender as GenderEnum ?? null);
      }
      if(command.hireDate !== undefined){
        employee.updateHireDate(new Date(command.hireDate!));
      }
      if(command.terminationDate !== undefined){
        employee.updateTerminationDate(command.terminationDate? new Date(command.terminationDate): null);
      }
      if(command.currentSalary !== undefined){
        employee.updateCurrentSalary(Number(command.currentSalary)?? 0);
      }
      if(command.isActive !== undefined){
        employee.updateIsActive(command.isActive ?? false);
      }
      if(command.photoUrl !== undefined){
        employee.updatePhotoUrl(command.photoUrl ?? null);
      }
      if(command.entryTime !== undefined){
        employee.updateEntryTime(command.entryTime ?? null);
      }
      if(command.exitTime !== undefined){
        employee.updateExitTime(command.exitTime ?? null);
      }
      const savedEntity = await this.employeeRepository.update(employee);
      return savedEntity;
    } catch (error) {
      throw error;
    }
  }
}