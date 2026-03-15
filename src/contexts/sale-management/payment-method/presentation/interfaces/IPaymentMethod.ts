export interface IPaymentMethod {
    paymentMethod: string,
    name: string,
    requiresReference: boolean,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
}
