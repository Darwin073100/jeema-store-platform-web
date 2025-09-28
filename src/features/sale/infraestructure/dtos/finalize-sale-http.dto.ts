import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";

export interface FinalizeSaleHttpDto {
    customerId: string;
    employeeId: string;
    status: SaleStatusEnum;
    notes?: string | null;
}