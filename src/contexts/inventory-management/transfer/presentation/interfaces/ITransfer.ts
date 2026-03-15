import { LocationEnum } from "@/contexts/inventory-management/inventory-item/domain/enums/location.enum";
import { TransferStatusEnum } from "../../domain/enums/transfer-status.enum";
import { IInventory } from "@/contexts/inventory-management/inventory/presentation/interfaces/IInventory";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";

export class ITransfer {
    transferId: bigint;
    inventoryId: bigint | null;
    fromBranchOfficeId: bigint | null;
    fromLocation: LocationEnum | null;
    toBranchOfficeId: bigint;
    toLocation: LocationEnum;
    quantityRequired: number;
    quantityTransferred: number | null;
    requestedByEmployeeId: bigint;
    approvedByEmployeeId: bigint | null;
    shippedByEmployeeId: bigint | null;
    receivedByEmployeeId: bigint | null;
    transferRequestDate: Date;
    transferShippedDate: Date | null;
    transferReceivedDate: Date | null;
    status: TransferStatusEnum;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    inventory: IInventory | null;
    fromBranchOffice: IBranchOffice | null;
    toBranchOffice: IBranchOffice | null;
    requestedByEmployee: IEmployee | null;
    approvedByEmployee: IEmployee | null;
    shippedByEmployee: IEmployee | null;
    receivedByEmployee: IEmployee | null;
}