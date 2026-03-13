import { DomainEvent } from "src/shared/domain/events/domain-events";
import { PaymentMethodEntity } from "../entities/payment-method-entity";

export class CategoryCreatedEvent extends DomainEvent<PaymentMethodEntity>{
    public readonly payload: any;

    constructor(payload: any){
        super(payload)
        this.payload = payload;
    }
}