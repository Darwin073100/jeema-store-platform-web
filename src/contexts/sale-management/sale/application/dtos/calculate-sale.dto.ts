import { RegisterSalePaymentDTO } from "src/contexts/sale-management/sale-payment/application/dtos/register-sale-payment.dto";
import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";

export class CalculateSaleDTO{
    readonly saleId     : bigint;
    readonly customerId : bigint;
    readonly employeeId : bigint;
    readonly cashRegisterId: bigint;
    readonly inAmount   : number;
    readonly status     : SaleStatusEnum;
    readonly salePayments: RegisterSalePaymentDTO[];
    readonly notes      : string| null;

    constructor(
        saleId     : bigint,
        customerId : bigint,
        employeeId : bigint,
        cashRegisterId: bigint,
        inAmount   : number,
        status     : SaleStatusEnum,
        salePayments: RegisterSalePaymentDTO[],
        notes      : string | null,
    ){
        this.saleId     = saleId;
        this.customerId = customerId;
        this.employeeId = employeeId;
        this.cashRegisterId = cashRegisterId;
        this.inAmount   = inAmount;
        this.status     = status;
        this.salePayments = salePayments;
        this.notes      = notes;
    }
}