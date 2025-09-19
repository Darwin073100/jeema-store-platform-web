export interface RegisterSalePaymentItemHttp {
    paymentMethodId: string;
    amountPaid: number;
    referenceNumber?: string| null;
}

export interface RegisterSalePaymentHttpDto {
    methods: RegisterSalePaymentItemHttp[]
}