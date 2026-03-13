import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { LocationEnum } from "../enums/location.enum";

interface Prop{
    value: LocationEnum;
}

export class InventoryItemLocationVO extends ValueObject<Prop>{
    private constructor (prop: Prop){
        super(prop);
    }

    static create(value: LocationEnum){
        return value;
    }
}