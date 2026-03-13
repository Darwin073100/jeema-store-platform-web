import { DomainEvent } from "src/shared/domain/events/domain-events";
import { SuplierEntity } from "../entities/suplier.entity";

export class SuplierCreatedEvent extends DomainEvent<SuplierEntity>{
    // Las propiedades del evento son inmutables y de solo lectura.
    public readonly payload: SuplierEntity;
  constructor(
    payload: SuplierEntity,
  ) {
    super(payload); // Llama al constructor de la clase base DomainEvent
    this.payload = payload;
  }
}