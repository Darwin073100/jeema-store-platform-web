import { LocationEnum } from "../enums/location.enum";
import { InventoryResponseDTO } from "./inventory-response.dto";
import { InventoryEntity } from "./inventory.entity";

export interface InventoryItemEntity{
    inventoryItemId      : bigint;
    inventoryId          : bigint;
    location             : LocationEnum;
    quantityOnHan        : number;
    lastStockedAt        : Date;
    purchasePriceAtStock : number;
    internalBarCode?     : string | null;
    createdAt            : Date;
    updatedAt?           : Date|null;
    deletedAt?           : Date|null;
    inventory?           : InventoryEntity|null;
}