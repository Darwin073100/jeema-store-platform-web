export interface SalePaymentResponseDTO{
    salePaymentId: bigint;
    paymentMethodId: bigint;
    saleId: bigint;
    amountPaid: number;
    referenceNumber?: string| null;
    createdAt: Date;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
}