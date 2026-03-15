import { IInventory } from "@/contexts/inventory-management/inventory/presentation/interfaces/IInventory";
import { LocationEnum } from "../../domain/enums/location.enum";

export interface IInventoryItem {
    inventoryItemId: bigint;
    inventoryId: bigint;
    location: LocationEnum;
    quantityOnHan: number;
    lastStockedAt: Date;
    purchasePriceAtStock: number;
    internalBarCode: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    inventory: IInventory | null;
}