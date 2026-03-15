import { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";
import { IInventory } from "@/contexts/inventory-management/inventory/presentation/interfaces/IInventory";
import { ISaleDetail } from "@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail";

export interface IReturns {
    returnsId: bigint,
    saleDetailId: bigint,
    employeeId: bigint,
    inventoryId: bigint,
    quantityReturn: number,
    amountReturn: number,
    notes: string | null,
    saleDetail: ISaleDetail | null,
    employee: IEmployee | null,
    inventory: IInventory | null,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
}