export interface PaymentMethodEntity {
  paymentMethodId: bigint;
  name: string;
  requiresReference: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
