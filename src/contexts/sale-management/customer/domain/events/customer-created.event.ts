import { DomainEvent } from "src/shared/domain/events/domain-events";
import { CustomerEntity } from "../entities/customer.entity";

export class CustomerCreatedEvent extends DomainEvent<CustomerEntity>{
    // Las propiedades del evento son inmutables y de solo lectura.
    public readonly payload: CustomerEntity;
  constructor(
    payload: CustomerEntity,
  ) {
    super(payload); // Llama al constructor de la clase base DomainEvent
    this.payload = payload;
  }
}