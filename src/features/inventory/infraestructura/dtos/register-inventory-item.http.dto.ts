import { LocationEnum } from "../../domain/enums/location.enum";

export interface RegisterInventoryItemHttpDTO {
    inventoryId          : string;
    location             : LocationEnum;
    quantityOnHand        : number;
    lastStockedAt        : string;
    purchasePriceAtStock : number;
    internalBarCode?     : string | null;
}