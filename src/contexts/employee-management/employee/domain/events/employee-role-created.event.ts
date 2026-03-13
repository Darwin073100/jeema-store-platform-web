import { DomainEvent } from "src/shared/domain/events/domain-events";
import { EmployeeEntity } from "../entities/employee.entity";

/**
 * EducationalCenterCreatedEvent es un Evento de Dominio que representa el hecho
 * de que un nuevo Centro Educativo ha sido creado en el sistema.
 * Es inmutable y contiene solo los datos relevantes para el hecho ocurrido.
 */
export class EmployeeRoleCreatedEvent extends DomainEvent<EmployeeEntity> {
  // Las propiedades del evento son inmutables y de solo lectura.
  public readonly payload: EmployeeEntity; 

  constructor(
    payload: EmployeeEntity,
  ) {
    super(payload); // Llama al constructor de la clase base DomainEvent
    this.payload = payload;
  }
}