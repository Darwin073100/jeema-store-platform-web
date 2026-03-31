export interface RegisterSalePaymentDTO {
    readonly paymentMethodId: bigint;
    readonly saleId: bigint;
    readonly amountPaid: number;
    readonly referenceNumber?: string| null;
}