export class PaymentMethodResponseDto {
  readonly paymentMethodId: string;
  readonly name: string;
  readonly requiresReference: boolean;
  readonly createdAt: Date; // La fecha de creación
  readonly updatedAt: Date | null; // La fecha de la última actualización
  readonly deletedAt: Date | null; // La fecha de borrado lógico

  constructor(
    paymentMethod: string,
    name: string,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    requiresReference: boolean,
  ) {
    this.paymentMethodId = paymentMethod;
    this.name = name;
    this.requiresReference = requiresReference;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    Object.freeze(this);
  }
}
