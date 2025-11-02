import { LocationEnum } from "../../domain/enums/location.enum";

export interface EditInventoryItemDTO{
    inventoryItemId      : bigint,
    inventoryId          : bigint,
    location             ?: LocationEnum,
    quantityOnHand       ?: number,
}