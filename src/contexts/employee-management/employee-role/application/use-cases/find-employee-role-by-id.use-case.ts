// src/contexts/educational-center-management/educational-center/application/use-cases/find-educational-center-by-id.use-case.ts

import { EmployeeRoleRepository } from '../../domain/repositories/employee-role.repository';
import { EmployeeRoleEntity } from '../../domain/entities/employee-role.entity';

/**
 * FindEstablishmentByIdUseCase es un Caso de Uso (o Servicio de Aplicación)
 * que se encarga de la lógica de orquestación para buscar un establesimiento por su ID.
 *
 * Su responsabilidad es coordinar la recuperación de la entidad de dominio a través del repositorio.
 */
export class FindEmployeeRoleByIdUseCase {
  constructor(
    // Inyectamos la interfaz del repositorio, manteniendo la Inversión de Dependencias.
    private readonly employeeRoleRepository: EmployeeRoleRepository,
  ) {}

  /**
   * Ejecuta el caso de uso para encontrar un establesimiento por su ID.
   *
   * @param id El ID (BigInt) del establesimiento a buscar.
   * @returns Una Promesa que se resuelve con la entidad Establishment si se encuentra,
   * o `null` si no existe.
   */
  public async execute(id: bigint): Promise<EmployeeRoleEntity | null> {
    // La lógica de este caso de uso es directa: simplemente delega al repositorio.
    // Aunque simple, es un caso de uso distinto porque el controlador lo invoca,
    // y si la lógica de búsqueda se volviera más compleja (ej. comprobaciones de seguridad,
    // carga de relaciones específicas), este sería el lugar para gestionarlo.
    const brand = await this.employeeRoleRepository.findById(id);

    return brand;
  }
}