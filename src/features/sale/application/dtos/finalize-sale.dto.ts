import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";

export interface FinalizeSaleDto {
    customerId: bigint;
    employeeId: bigint;
    status: SaleStatusEnum;
    notes?: string | null;
}