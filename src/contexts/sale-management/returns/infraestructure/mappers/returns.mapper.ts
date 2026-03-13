import { SaleDetailMapper } from "src/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/mappers/sale-detail.mapper";
import { ReturnsEntity } from "../../domain/entities/returns.entity";
import {ReturnsOrmEntity } from "../entities/returns.orm-entity";
import { EmployeeMapper } from "src/contexts/employee-management/employee/infraestruture/persistence/typeorm/mappers/employee.mapper";
import { InventoryMapper } from "src/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/mapper/inventory.mapper";

export class ReturnsMapper {
    static toDomain(ormEntity: ReturnsOrmEntity){
        const domainEntity = ReturnsEntity.reconstitute(
            ormEntity.returnsId,
            ormEntity.saleDetailId,
            ormEntity.employeeId,
            ormEntity.inventoryId,
            ormEntity.quantityReturn,
            ormEntity.amountReturn,
            ormEntity.notes,
            ormEntity.saleDetail? SaleDetailMapper.toDomainEntity(ormEntity.saleDetail): null,
            ormEntity.employee? EmployeeMapper.toDomainEntity(ormEntity.employee): null,
            ormEntity.inventory? InventoryMapper.toDomain(ormEntity.inventory): null,
            ormEntity.createdAt,
            ormEntity.updatedAt,
            ormEntity.deletedAt,
        );
        return domainEntity;
    }
    static toOrm(domainEntity: ReturnsEntity){
        const ormEntity: ReturnsOrmEntity = {
            returnsId: domainEntity.returnsId,
            saleDetailId: domainEntity.saleDetailId,
            employeeId: domainEntity.employeeId,
            inventoryId: domainEntity.inventoryId,
            quantityReturn: domainEntity.quantityReturn,
            amountReturn: domainEntity.amountReturn,
            notes: domainEntity.notes,
            createdAt: domainEntity.createdAt,
            updatedAt: domainEntity.updatedAt,
            deletedAt: domainEntity.deletedAt,
            inventory: domainEntity.inventory ? InventoryMapper.toOrmEntity(domainEntity.inventory) : null,
            saleDetail: domainEntity.saleDetail ? SaleDetailMapper.toOrmEntity(domainEntity.saleDetail) : null,
            employee: domainEntity.employee ? EmployeeMapper.toOrmEntity(domainEntity.employee) : null,
        };
        return ormEntity;
    }
}