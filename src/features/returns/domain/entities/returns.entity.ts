import { EmployeeEntity } from "@/features/employee/domain/entities/employee.entity";
import { InventoryEntity } from "@/features/inventory/domain/entities/inventory.entity";
import { SaleDetailEntity } from "@/features/sale/domain/entities/sale-detail-entity";

export interface ReturnsEntity {
    returnsId: bigint,
    saleDetailId: bigint,
    employeeId: bigint,
    inventoryId: bigint,
    quantityReturn: number,
    amountReturn: number,
    notes: string | null,
    saleDetail: SaleDetailEntity | null,
    employee: EmployeeEntity | null,
    inventory: InventoryEntity | null,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
}