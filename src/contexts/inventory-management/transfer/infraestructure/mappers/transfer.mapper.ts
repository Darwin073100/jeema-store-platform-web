import { InventoryMapper } from "src/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/mapper/inventory.mapper";
import { TransferEntity } from "../../domain/entities/transafer.entity";
import { TransferOrmEntity } from "../entities/transfer.orm-entity";
import { EmployeeMapper } from "src/contexts/employee-management/employee/infraestruture/persistence/typeorm/mappers/employee.mapper";
import { BranchOfficeMapper } from "src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/mappers/branch-office.mapper";

export class TransferMapper {
    static toDomain(ormEntity: TransferOrmEntity){
        const domainEntity = TransferEntity.reconstitute(
            ormEntity.transferId,
            ormEntity.inventoryId,
            ormEntity.fromBranchOfficeId,
            ormEntity.fromLocation,
            ormEntity.toBranchOfficeId,
            ormEntity.toLocation,
            ormEntity.quantityRequired,
            ormEntity.quantityTransferred,
            ormEntity.requestedByEmployeeId,
            ormEntity.approvedByEmployeeId,
            ormEntity.shippedByEmployeeId,
            ormEntity.receivedByEmployeeId,
            ormEntity.transferRequestDate,
            ormEntity.transferShippedDate,
            ormEntity.transferReceivedDate,
            ormEntity.status,
            ormEntity.notes,
            ormEntity.createdAt,
            ormEntity.updatedAt,
            ormEntity.deletedAt,
            ormEntity.inventory ? InventoryMapper.toDomain(ormEntity.inventory) : null,
            ormEntity.fromBranchOffice ? BranchOfficeMapper.toDomainEntity(ormEntity.fromBranchOffice) : null,
            ormEntity.toBranchOffice ? BranchOfficeMapper.toDomainEntity(ormEntity.toBranchOffice) : null,
            ormEntity.requestedByEmployee ? EmployeeMapper.toDomainEntity(ormEntity.requestedByEmployee) : null,
            ormEntity.approvedByEmployee ? EmployeeMapper.toDomainEntity(ormEntity.approvedByEmployee) : null,
            ormEntity.shippedByEmployee ? EmployeeMapper.toDomainEntity(ormEntity.shippedByEmployee) : null,
            ormEntity.receivedByEmployee ? EmployeeMapper.toDomainEntity(ormEntity.receivedByEmployee) : null,
        );
        return domainEntity;
    }

    static toOrmEntity(domainEntity: TransferEntity){
        const ormEntity = new TransferOrmEntity();
        ormEntity.transferId = domainEntity.transferId;
        ormEntity.inventoryId = domainEntity.inventoryId;
        ormEntity.fromBranchOfficeId = domainEntity.fromBranchOfficeId;
        ormEntity.fromLocation = domainEntity.fromLocation;
        ormEntity.toBranchOfficeId = domainEntity.toBranchOfficeId;
        ormEntity.toLocation = domainEntity.toLocation;
        ormEntity.quantityRequired = domainEntity.quantityRequired;
        ormEntity.quantityTransferred = domainEntity.quantityTransferred;
        ormEntity.requestedByEmployeeId = domainEntity.requestedByEmployeeId;
        ormEntity.approvedByEmployeeId = domainEntity.approvedByEmployeeId;
        ormEntity.shippedByEmployeeId = domainEntity.shippedByEmployeeId;
        ormEntity.receivedByEmployeeId = domainEntity.receivedByEmployeeId;
        ormEntity.transferRequestDate = domainEntity.transferRequestDate;
        ormEntity.transferShippedDate = domainEntity.transferShippedDate;
        ormEntity.transferReceivedDate = domainEntity.transferReceivedDate;
        ormEntity.status = domainEntity.status;
        ormEntity.notes = domainEntity.notes;
        ormEntity.createdAt = domainEntity.createdAt;
        ormEntity.updatedAt = domainEntity.updatedAt;
        ormEntity.deletedAt = domainEntity.deletedAt;
        ormEntity.inventory = domainEntity.inventory ? InventoryMapper.toOrmEntity(domainEntity.inventory) : null;
        ormEntity.fromBranchOffice = domainEntity.fromBranchOffice ? BranchOfficeMapper.toOrmEntity(domainEntity.fromBranchOffice) : null;
        ormEntity.toBranchOffice = domainEntity.toBranchOffice ? BranchOfficeMapper.toOrmEntity(domainEntity.toBranchOffice) : null;
        ormEntity.requestedByEmployee = domainEntity.requestedByEmployee ? EmployeeMapper.toOrmEntity(domainEntity.requestedByEmployee) : null;
        ormEntity.approvedByEmployee = domainEntity.approvedByEmployee ? EmployeeMapper.toOrmEntity(domainEntity.approvedByEmployee) : null;
        ormEntity.shippedByEmployee = domainEntity.shippedByEmployee ? EmployeeMapper.toOrmEntity(domainEntity.shippedByEmployee) : null;
        ormEntity.receivedByEmployee = domainEntity.receivedByEmployee ? EmployeeMapper.toOrmEntity(domainEntity.receivedByEmployee) : null;

        return ormEntity;
    }
}