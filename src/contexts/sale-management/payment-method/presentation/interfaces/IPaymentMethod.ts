export interface IPaymentMethod {
    paymentMethodId: bigint,
    name: string,
    requiresReference: boolean,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
}
