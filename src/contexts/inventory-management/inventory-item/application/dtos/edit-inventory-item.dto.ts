import { LocationEnum } from "../../domain/enums/location.enum";

export class EditInventoryItemDto {
    readonly inventoryItemId      : bigint;
    readonly inventoryId          : bigint;
    readonly location             ?: LocationEnum;
    readonly quantityOnHan        ?: number;
    
    constructor(
        inventoryItemId      : bigint,
        inventoryId          : bigint,
        location             ?: LocationEnum,
        quantityOnHan        ?: number,
    ) {
        this.inventoryItemId      = inventoryItemId;
        this.inventoryId          = inventoryId;
        this.location             = location;
        this.quantityOnHan        = quantityOnHan;
    }

}