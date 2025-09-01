import { LocationEnum } from "../../domain/enums/location.enum";

export interface UpdateInventoryItemDTO {
    inventoryItemId      : bigint;
    inventoryId          : bigint;
    location             : LocationEnum;
    quantityOnHan        : number;
    lastStockedAt        : Date;
    purchasePriceAtStock : number;
    internalBarCode?     : string | null;
}