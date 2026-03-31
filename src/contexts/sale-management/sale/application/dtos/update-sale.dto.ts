export interface UpdatePaymentMethodDTO{
    readonly paymentMethodId: bigint;
    readonly name: string;
    readonly requiresReference: boolean;
}