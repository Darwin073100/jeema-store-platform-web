import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";

export interface FinalizeSaleDto {
    customerId: bigint;
    employeeId: bigint;
    cashRegisterId: bigint;
    inAmount: number;
    status: SaleStatusEnum;
    notes?: string | null;
}