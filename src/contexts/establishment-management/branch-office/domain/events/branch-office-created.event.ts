import { DomainEvent } from "src/shared/domain/events/domain-events";
import { BranchOfficeEntity } from "../entities/branch-office.entity";

export class BranchOfficeCreatedEvent extends DomainEvent<BranchOfficeEntity>{
    // Las propiedades del evento son inmutables y de solo lectura.
    public readonly payload: BranchOfficeEntity;
  constructor(
    payload: BranchOfficeEntity,
  ) {
    super(payload); // Llama al constructor de la clase base DomainEvent
    this.payload = payload;
  }
}