import { EmployeeResponseDto } from "src/contexts/employee-management/employee/application/dtos/employee-response.dto";
import { InventoryResponseDto } from "src/contexts/inventory-management/inventory/application/dtos/inventory-response.dto";
import { SaleDetailResponseDto } from "src/contexts/sale-management/sale-detail/application/dtos/sale-detail-response.dto";

export class ReturnsResponse {
    constructor(
        public readonly returnsId: bigint,
        public readonly saleDetailId: bigint,
        public readonly employeeId: bigint,
        public readonly inventoryId: bigint,
        public readonly quantityReturn: number,
        public readonly amountReturn: number,
        public readonly notes: string | null,
        public readonly saleDetail: SaleDetailResponseDto | null,
        public readonly employee: EmployeeResponseDto | null,
        public readonly inventory: InventoryResponseDto | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date | null,
        public readonly deletedAt: Date | null,
    ){}
}