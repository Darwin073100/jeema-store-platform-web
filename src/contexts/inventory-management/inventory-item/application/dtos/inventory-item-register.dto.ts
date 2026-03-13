import { LocationEnum } from "../../domain/enums/location.enum";

export class InventoryItemRegisterDto {
    readonly inventoryId            : bigint;
    readonly location             : LocationEnum;
    readonly quantityOnHan        : number;
    
    constructor(
        inventoryId            : bigint,
        location             : LocationEnum,
        quantityOnHan        : number,
    ) {
        this.inventoryId            = inventoryId;
        this.location             = location;
        this.quantityOnHan        = quantityOnHan;
    }

}