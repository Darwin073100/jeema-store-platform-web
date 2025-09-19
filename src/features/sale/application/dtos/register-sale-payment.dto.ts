export interface RegisterSalePaymentItem {
    paymentMethodId: bigint;
    amountPaid: number;
    referenceNumber?: string| null;
}

export interface RegisterSalePaymentDto {
    methods: RegisterSalePaymentItem[]
}