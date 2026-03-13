import { DomainEvent } from "src/shared/domain/events/domain-events";
import { RoleEntity } from "../entities/role-entity";

export class RoleCreatedEvent extends DomainEvent<RoleEntity>{
    public readonly payload: any;

    constructor(payload: any){
        super(payload)
        this.payload = payload;
    }
}