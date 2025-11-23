import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";

export interface FinalizeSaleHttpDto {
    customerId: string;
    employeeId: string;
    cashRegisterId: string;
    inAmount: number;
    status: SaleStatusEnum;
    notes?: string | null;
}