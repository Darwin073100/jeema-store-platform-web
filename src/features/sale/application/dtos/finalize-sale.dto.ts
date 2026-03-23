import { SaleStatusEnum } from "../../../../contexts/sale-management/sale/domain/enums/sale-status.enum";
import { RegisterSalePaymentItem } from "./register-sale-payment.dto";

export interface FinalizeSaleDto {
    customerId: bigint;
    employeeId: bigint;
    cashRegisterId: bigint;
    inAmount: number;
    status: SaleStatusEnum;
    salePayments?: RegisterSalePaymentItem[];
    notes?: string | null;
}