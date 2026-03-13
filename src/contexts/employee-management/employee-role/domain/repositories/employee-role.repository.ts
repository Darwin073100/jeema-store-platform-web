import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { EmployeeRoleEntity } from "../entities/employee-role.entity";

export const EMPLOYEE_ROLE_REPOSITORY = Symbol('EMPLOYEE_ROLE_REPOSITORY');
/**
 * EmployeeRoleRepository es una interfaz (Puerto de Salida) que define
 * el contrato para la persistencia de los objetos EmployeeRole.
 *
 * Esta interfaz es parte de la capa de Dominio, lo que significa que el Dominio
 * define lo que necesita para interactuar con la persistencia, no cómo se implementa.
 * Esto asegura la Inversión de Dependencias y la Independencia del Framework.
 */
export interface EmployeeRoleRepository extends TemplateRepository<EmployeeRoleEntity> {
    findByName(name: string): Promise<EmployeeRoleEntity | null>;
}