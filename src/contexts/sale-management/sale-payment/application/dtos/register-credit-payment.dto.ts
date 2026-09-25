export interface RegisterCreditPaymentItemDTO {
    readonly paymentMethodId: bigint;
    readonly amountPaid: number;
    readonly referenceNumber?: string | null;
}

export interface RegisterCreditPaymentDTO {
    readonly saleId: bigint;
    readonly employeeId: bigint;
    readonly cashRegisterId: bigint;
    readonly payments: RegisterCreditPaymentItemDTO[];
}
