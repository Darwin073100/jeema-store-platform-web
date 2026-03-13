import { EmployeeRepository } from '../../domain/repositories/employee.repository';
import { EmployeeEntity } from '../../domain/entities/employee.entity';

export class FindAllEmployeeByEstablishmentIdUseCase {
  constructor(
    // Inyectamos la interfaz del repositorio, manteniendo la Inversión de Dependencias.
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  public async execute(establishmentId: bigint): Promise<EmployeeEntity[]> {
    const employees = await this.employeeRepository.findAllByEstablishmentId(establishmentId);
    return employees;
  }
}