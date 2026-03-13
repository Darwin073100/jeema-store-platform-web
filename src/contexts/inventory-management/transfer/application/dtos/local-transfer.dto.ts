import { LocationEnum } from "src/contexts/inventory-management/inventory-item/domain/enums/location.enum";

export class LocalTransferDTO{
    inventoryId: bigint;
    fromLocation: LocationEnum;
    branchOfficeId: bigint;
    toLocation: LocationEnum;
    quantity: number
    requestedByEmployeeId: bigint;
    notes: string | null;
}