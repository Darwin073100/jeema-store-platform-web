export class RegisterSalePaymentDTO {
    readonly paymentMethodId: bigint;
    readonly saleId: bigint;
    readonly amountPaid: number;
    readonly referenceNumber?: string| null;

    constructor(
        paymentMethodId: bigint,
        saleId: bigint,
        amountPaid: number,
        referenceNumber?: string | null,
    ){
        this.paymentMethodId = paymentMethodId;
        this.saleId = saleId;
        this.amountPaid = amountPaid;
        this.referenceNumber = referenceNumber;
        Object.freeze(this);
    }
}