import { SaleStatusEnum } from "../../../../contexts/sale-management/sale/domain/enums/sale-status.enum";
import { RegisterSalePaymentItemHttp } from "./register-sale-payment-http.dto";

export interface FinalizeSaleHttpDto {
    customerId: string;
    employeeId: string;
    cashRegisterId: string;
    inAmount: number;
    status: SaleStatusEnum;
    salePayments?: RegisterSalePaymentItemHttp[];
    notes?: string | null;
}