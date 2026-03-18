import { LocationEnum } from "../../domain/enums/location.enum";

export interface InventoryItemRegisterDto {
    readonly inventoryId            : bigint;
    readonly location             : LocationEnum;
    readonly quantityOnHan        : number;
}