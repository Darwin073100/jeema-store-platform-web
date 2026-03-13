import { DomainEvent } from "src/shared/domain/events/domain-events";
import { CategoryEntity } from "../entities/category-entity";

export class CategoryCreatedEvent extends DomainEvent<CategoryEntity>{
    public readonly payload: any;

    constructor(payload: any){
        super(payload)
        this.payload = payload;
    }
}