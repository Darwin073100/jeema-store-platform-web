import { InventoryMapper } from "src/contexts/inventory-management/inventory/application/mapper/inventory.mapper";
import { TransferEntity } from "../../domain/entities/transafer.entity";
import { TransferResponseDTO } from "../dtos/transfer-response.dto";
import { BranchOfficeMapper } from "src/contexts/establishment-management/branch-office/application/mappers/branch-office.mapper";
import { EmployeeMapper } from "src/contexts/employee-management/employee/application/mappers/employee.mapper";

export class TransferMapper {
    static toResponseDto(transfer: TransferEntity): TransferResponseDTO {
        const dto: TransferResponseDTO = {
            transferId: transfer.transferId?.toString() ?? null,
            inventoryId: transfer.inventoryId?.toString() ?? null,
            fromBranchOfficeId: transfer.fromBranchOfficeId?.toString() ?? null,
            fromLocation: transfer.fromLocation,
            toBranchOfficeId: transfer?.toBranchOfficeId?.toString() ?? null,
            toLocation: transfer.toLocation,
            quantityRequired: transfer.quantityRequired,
            quantityTransferred: transfer.quantityTransferred,
            requestedByEmployeeId: transfer.requestedByEmployeeId?.toString() ?? null,
            approvedByEmployeeId: transfer.approvedByEmployeeId ? transfer.approvedByEmployeeId.toString() : null,
            shippedByEmployeeId: transfer.shippedByEmployeeId ? transfer.shippedByEmployeeId.toString() : null,
            receivedByEmployeeId: transfer.receivedByEmployeeId ? transfer.receivedByEmployeeId.toString() : null,
            transferRequestDate: transfer?.transferRequestDate ?? null,
            transferShippedDate: transfer?.transferShippedDate ?? null,
            transferReceivedDate: transfer?.transferReceivedDate ?? null,
            status: transfer?.status ?? null,
            notes: transfer?.notes ?? null,
            createdAt: transfer.createdAt,
            updatedAt: transfer.updatedAt,
            deletedAt: transfer.deletedAt,
            inventory: transfer.inventory ? InventoryMapper.toResponseDto(transfer.inventory) : null,
            fromBranchOffice: transfer.fromBranchOffice ? BranchOfficeMapper.toResponseDto(transfer.fromBranchOffice) : null,
            toBranchOffice: transfer.toBranchOffice ? BranchOfficeMapper.toResponseDto(transfer.toBranchOffice) : null,
            requestedByEmployee: transfer.requestedByEmployee ? EmployeeMapper.toResponseDto(transfer.requestedByEmployee) : null,
            approvedByEmployee: transfer.approvedByEmployee ? EmployeeMapper.toResponseDto(transfer.approvedByEmployee) : null,
            shippedByEmployee: transfer.shippedByEmployee ? EmployeeMapper.toResponseDto(transfer.shippedByEmployee) : null,
            receivedByEmployee: transfer.receivedByEmployee ? EmployeeMapper.toResponseDto(transfer.receivedByEmployee) : null,
        };
        return dto;
    }
}