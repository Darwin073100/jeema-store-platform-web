import { BranchOfficeEntity } from "@/features/branch-office/domain/entities/branch-office.entity";
import { EmployeeEntity } from "@/features/employee/domain/entities/employee.entity";
import { InventoryEntity } from "@/features/inventory/domain/entities/inventory.entity";
import { LocationEnum } from "@/features/inventory/domain/enums/location.enum";
import { TransferStatusEnum } from "../enums/transfer-status.enum";

export interface TransferEntity {
    transferId: string;
    inventoryId: string | null;
    fromBranchOfficeId: string | null;
    fromLocation: LocationEnum | null;
    toBranchOfficeId: string;
    toLocation: LocationEnum;
    quantityRequired: number;
    quantityTransferred: number | null;
    requestedByEmployeeId: string;
    approvedByEmployeeId: string | null;
    shippedByEmployeeId: string | null;
    receivedByEmployeeId: string | null;
    transferRequestDate: Date;
    transferShippedDate: Date | null;
    transferReceivedDate: Date | null;
    status: TransferStatusEnum;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    inventory: InventoryEntity | null;
    fromBranchOffice: BranchOfficeEntity | null;
    toBranchOffice: BranchOfficeEntity | null;
    requestedByEmployee: EmployeeEntity | null;
    approvedByEmployee: EmployeeEntity | null;
    shippedByEmployee: EmployeeEntity | null;
    receivedByEmployee: EmployeeEntity | null;
}