import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { EmployeeEntity } from "../entities/employee.entity";

export const EMPLOYEE_REPOSITORY = Symbol('EMPLOYEE_REPOSITORY');
/**
 * EmployeeRepository es una interfaz (Puerto de Salida) que define
 * el contrato para la persistencia de los objetos Employee.
 *
 * Esta interfaz es parte de la capa de Dominio, lo que significa que el Dominio
 * define lo que necesita para interactuar con la persistencia, no cómo se implementa.
 * Esto asegura la Inversión de Dependencias y la Independencia del Framework.
 */
export interface EmployeeRepository extends TemplateRepository<EmployeeEntity> {
  existById(employeeId: bigint): Promise<EmployeeEntity | null>;
  findAllByEstablishmentId(establishmentId: bigint): Promise<EmployeeEntity[]>;
  update(employee: EmployeeEntity): Promise<EmployeeEntity>;
}