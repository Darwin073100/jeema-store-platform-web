import { DomainEvent } from "src/shared/domain/events/domain-events";
import { EmployeeRoleEntity } from "../entities/employee-role.entity";

/**
 * EducationalCenterCreatedEvent es un Evento de Dominio que representa el hecho
 * de que un nuevo Centro Educativo ha sido creado en el sistema.
 * Es inmutable y contiene solo los datos relevantes para el hecho ocurrido.
 */
export class EmployeeRoleCreatedEvent extends DomainEvent<EmployeeRoleEntity> {
  // Las propiedades del evento son inmutables y de solo lectura.
  public readonly payload: EmployeeRoleEntity; 

  constructor(
    payload: EmployeeRoleEntity,
  ) {
    super(payload); // Llama al constructor de la clase base DomainEvent
    this.payload = payload;
  }
}