import { DomainEvent } from "src/shared/domain/events/domain-events";
import { BrandNameVO } from "../values-objects/brand-name.vo";
import { BrandCreatedEvent } from "../events/brand-created.event";
import { ProductEntity } from "src/contexts/product-management/product/domain/entities/product.entity";
import { EstablishmentEntity } from "src/contexts/establishment-management/establishment/domain/entities/establishment.entity";

export class BrandEntity {
    private readonly _brandId: bigint;
    private _establishmentId: bigint;
    private _name: BrandNameVO;
    private readonly _createdAt: Date;
    private _updatedAt: Date | null;
    private _deletedAt: Date | null;
    private _products: ProductEntity[] | null;
    private _establishment: EstablishmentEntity | null;

    private constructor(
    brandId: bigint,
    establishmentId: bigint,
    name: BrandNameVO,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    products: ProductEntity[] | null,
    establishment: EstablishmentEntity | null,
    ) {
      this._establishmentId = establishmentId;
      this._brandId = brandId;
      this._name = name;
      this._createdAt = createdAt;
      this._updatedAt = updatedAt;
      this._deletedAt = deletedAt;
      this._products = products;
      this._establishment = establishment;
    }

    /**
   * Crea una nueva instancia de Establishment.
   * Este es un método de fábrica para asegurar la creación controlada del agregado.
   * Un evento de dominio EstablishmentCreatedEvent se registra internamente.
   *
   * @param brandId El ID único del centro educativo.
   * @param name El nombre del centro educativo.
   * @returns Una nueva instancia de Establishment.
   */
  static create(establishmentId: bigint, name: string): BrandEntity {
    const brand = new BrandEntity(
      BigInt(0),
      establishmentId,
      BrandNameVO.create(name),
      new Date(), // createdAt
      null, // updatedAt
      null, // deletedAt
      null, // productos siempre undefined/null en create
      null,
    );
    return brand;
  }

  /**
   * Reconstituye una instancia de Establishment desde la persistencia.
   * No emite eventos ya que representa un estado ya existente.
   *
   * @param brandId El ID único del centro educativo.
   * @param name El nombre del centro educativo.
   * @param createdAt La fecha de creación.
   * @param updatedAt La fecha de la última actualización.
   * @param deletedAt La fecha de borrado lógico.
   * @returns Una instancia de Establishment reconstituida.
   */
  static reconstitute(
    brandId: bigint,
    establishmentId: bigint,
    name: string,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    products: ProductEntity[] | null,
    establishment: EstablishmentEntity | null,
  ): BrandEntity {
    return new BrandEntity(
      brandId, 
      establishmentId,
      BrandNameVO.create(name), 
      createdAt, 
      updatedAt, 
      deletedAt, 
      products,
      establishment,
    );
  }

  // Getters
  get brandId(): bigint {
    return this._brandId;
  }
  get establishment(){
    return this._establishment;
  }
  get establishemntId(){
    return this._establishmentId;
  }
  get name(): string {
    return this._name.value;
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

  get products(): ProductEntity[] | null {
    return this._products;
  }


  // Métodos de comportamiento del dominio
  public updateName(newName: string): void {
    this._name = BrandNameVO.create(newName);
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

  public restore(): void {
    if (!this._deletedAt) {
      return; // No está eliminado
    }
    this._deletedAt = null;
    this._updatedAt = new Date();
    // this.recordEvent(new EstablishmentRestoredEvent(this.id));
  }
}

