import { LocationEnum } from "@/features/inventory/domain/enums/location.enum";

export interface LocalTransferDTO{
    inventoryId: bigint;
    fromLocation: LocationEnum;
    branchOfficeId: bigint;
    toLocation: LocationEnum;
    quantity: number
    requestedByEmployeeId: bigint;
    notes: string | null;
}