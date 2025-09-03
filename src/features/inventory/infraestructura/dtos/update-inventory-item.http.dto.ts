import { LocationEnum } from "../../domain/enums/location.enum";

export interface UpdateInventoryItemHttpDTO {
    inventoryItemId      : string;
    inventoryId          : string;
    location             : LocationEnum;
    quantityOnHand       : number;
    lastStockedAt        : string;
    purchasePriceAtStock : number;
    internalBarCode?     : string | null;
}