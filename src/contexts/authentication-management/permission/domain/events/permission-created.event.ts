import { DomainEvent } from "src/shared/domain/events/domain-events";
import { PermissionEntity } from "../entities/permission-entity";

export class PermissionCreatedEvent extends DomainEvent<PermissionEntity>{
    public readonly payload: any;

    constructor(payload: any){
        super(payload)
        this.payload = payload;
    }
}