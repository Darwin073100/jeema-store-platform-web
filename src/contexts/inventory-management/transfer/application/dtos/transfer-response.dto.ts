import { LocationEnum } from "src/contexts/inventory-management/inventory-item/domain/enums/location.enum";
import { TransferStatusEnum } from "../../domain/enums/transfer-status.enum";
import { InventoryResponseDto } from "src/contexts/inventory-management/inventory/application/dtos/inventory-response.dto";
import { BranchOfficeResponseDto } from "src/contexts/establishment-management/branch-office/application/dtos/branch-office-response.dto";
import { EmployeeResponseDto } from "src/contexts/employee-management/employee/application/dtos/employee-response.dto";

export class TransferResponseDTO {
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
    inventory: InventoryResponseDto | null;
    fromBranchOffice: BranchOfficeResponseDto | null;
    toBranchOffice: BranchOfficeResponseDto | null;
    requestedByEmployee: EmployeeResponseDto | null;
    approvedByEmployee: EmployeeResponseDto | null;
    shippedByEmployee: EmployeeResponseDto | null;
    receivedByEmployee: EmployeeResponseDto | null;
}