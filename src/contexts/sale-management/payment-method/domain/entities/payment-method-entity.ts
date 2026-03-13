import { SalePaymentEntity } from 'src/contexts/sale-management/sale-payment/domain/entities/sale-payment.entity';
import { PaymentMethodNameVO } from '../value-objects/payment-method-name.vo';

export class PaymentMethodEntity {
  private readonly _paymentMethodId : bigint;
  private _name                     : PaymentMethodNameVO;
  private _requiresReference        : boolean;
  private readonly _createdAt       : Date;
  private _updatedAt                : Date | null;
  private _deletedAt                : Date | null;
  private _salePayments?            : SalePaymentEntity[] | null

  private constructor(
    paymentMethodId   : bigint,
    name              : PaymentMethodNameVO,
    createdAt         : Date,
    updatedAt         : Date | null,
    deletedAt         : Date | null,
    requiresReference : boolean,
    salePayments?     : SalePaymentEntity[] | null,
  ) {
    this._paymentMethodId   = paymentMethodId;
    this._name              = name;
    this._requiresReference = requiresReference;
    this._createdAt         = createdAt;
    this._updatedAt         = updatedAt;
    this._deletedAt         = deletedAt;
    this._salePayments      = salePayments;
  }

  /**
   * Crea una nueva instancia de PaymentMethod.
   * Este es un método de fábrica para asegurar la creación controlada del agregado.
   * Un evento de dominio PaymentMethodCreatedEvent se registra internamente.
   *
   * @param paymentMethodId El ID único de la categoría.
   * @param name El nombre del centro educativo.
   * @returns Una nueva instancia de PaymentMethod.
   */

  static create(
    name: PaymentMethodNameVO,
    requiresReference: boolean,
  ): PaymentMethodEntity {
    const paymentMethod = new PaymentMethodEntity(
      BigInt(new Date().getTime()),
      name,
      new Date(),
      null,
      null,
      requiresReference,
      null,
    );
    return paymentMethod;
  }

  static reconstitute(
    paymentMethodId: bigint,
    name: PaymentMethodNameVO,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    requiresReference: boolean,
    salePayments?: SalePaymentEntity[] | null
  ): PaymentMethodEntity {
    return new PaymentMethodEntity(
      paymentMethodId,
      name,
      createdAt,
      updatedAt,
      deletedAt,
      requiresReference,
      salePayments,
    );
  }

  // Getters
  get paymentMethodId(): bigint {
    return this._paymentMethodId;
  }

  get name(): PaymentMethodNameVO {
    return this._name;
  }

  get requiresReference(): boolean {
    return this._requiresReference;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  get salePayments(): SalePaymentEntity[] | null | undefined {
    return this._salePayments;
  }

  // Métodos de comportamiento del dominio
    public updateName(newValue: PaymentMethodNameVO): void {
      if (this._name.equals(newValue)) {
        return; // No hay cambio, no se hace nada
      }
      this._name = newValue;
      this._updatedAt = new Date();
    }

  // Métodos de comportamiento del dominio
    public updateRequiresReference(newValue:boolean): void {
      this._requiresReference = newValue;
      this._updatedAt = new Date();
    }
  

  public softDelete(): void {
    if (this._deletedAt) {
      return; // Ya está marcado como eliminado
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date(); // Actualizamos también la fecha de actualización
    // this.recordEvent(new EstablishmentDeletedEvent(this.id));
  }
}
