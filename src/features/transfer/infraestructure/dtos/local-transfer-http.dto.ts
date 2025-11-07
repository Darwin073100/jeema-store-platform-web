import { LocationEnum } from "@/features/inventory/domain/enums/location.enum";

export interface LocalTransferHttpDTO{
    inventoryId: string;
    fromLocation: LocationEnum;
    branchOfficeId: string;
    toLocation: LocationEnum;
    quantity: number
    requestedByEmployeeId: string;
    notes: string | null;
}