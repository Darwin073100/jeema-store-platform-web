import { RegisterSalePaymentDTO } from "src/contexts/sale-management/sale-payment/application/dtos/register-sale-payment.dto";
import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";

export interface CalculateSaleDTO{
    readonly saleId     : bigint;
    readonly customerId : bigint;
    readonly employeeId : bigint;
    readonly cashRegisterId: bigint;
    readonly inAmount   : number;
    readonly status     : SaleStatusEnum;
    readonly salePayments: RegisterSalePaymentDTO[];
    readonly notes      : string| null;
}