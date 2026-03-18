import { LocationEnum } from "../../domain/enums/location.enum";

export interface EditInventoryItemDto {
    readonly inventoryItemId      : bigint;
    readonly inventoryId          : bigint;
    readonly location             ?: LocationEnum;
    readonly quantityOnHan        ?: number;
}