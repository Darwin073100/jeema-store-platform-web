import { DomainEvent } from 'src/shared/domain/events/domain-events';
import { CategoryNameVO } from '../value-objects/category-name.vo';
import { CategoryDescriptionVO } from '../value-objects/category-description.vo';
import { CategoryCreatedEvent } from '../events/category-created.event';
import { ProductEntity } from 'src/contexts/product-management/product/domain/entities/product.entity';
import { EstablishmentEntity } from 'src/contexts/establishment-management/establishment/domain/entities/establishment.entity';

export class CategoryEntity {
  private readonly _categoryId: bigint;
  private _establishmentId: bigint;
  private _name: CategoryNameVO;
  private _description: CategoryDescriptionVO | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date | null;
  private _deletedAt: Date | null;
  private _domainEvents: DomainEvent<CategoryEntity>[] = [];
  private _products: ProductEntity[] | null;
  private _establishment: EstablishmentEntity | null;

  private constructor(
    categoryId: bigint,
    establishmentId: bigint,
    name: string,
    description: string | null,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    products: ProductEntity[] | null,
    establishment: EstablishmentEntity | null,
  ) {
    this._categoryId = categoryId;
    this._establishmentId = establishmentId;
    this._name = CategoryNameVO.create(name);
    this._description = CategoryDescriptionVO.create(description);
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
    this._products = products ?? null;
    this._establishment = establishment ?? null;
  }

  /**
   * Crea una nueva instancia de Category.
   * Este es un método de fábrica para asegurar la creación controlada del agregado.
   * Un evento de dominio CategoryCreatedEvent se registra internamente.
   *
   * @param categoryId El ID único de la categoría.
   * @param name El nombre del centro educativo.
   * @returns Una nueva instancia de Category.
   */

  static create(
    establishmentId: bigint,
    name: string,
    description: string | null,
  ): CategoryEntity {
    const category = new CategoryEntity(
      BigInt(0),
      establishmentId,
      name,
      description,
      new Date(),
      null,
      null,
      null, // productos siempre undefined/null en create
      null,
    );
    category.recordEvent(new CategoryCreatedEvent(category));
    return category;
  }

  static reconstitute(
    categoryId: bigint,
    establishmentId: bigint,
    name: string,
    description: string | null,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    products: ProductEntity[] | null,
    establishment: EstablishmentEntity | null,
  ): CategoryEntity {
    return new CategoryEntity(
      categoryId,
      establishmentId,
      name,
      description,
      createdAt,
      updatedAt,
      deletedAt,
      products,
      establishment,
    );
  }

  // Getters
  get categoryId(): bigint {
    return this._categoryId;
  }
  get establishmentId(): bigint {
    return this._establishmentId;
  }
  get name(): string {
    return this._name.name;
  }
  get description(): string | null {
    return this._description?.description ?? null;
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
  get establishment(): EstablishmentEntity | null {
    return this._establishment;
  }

  // Métodos de comportamiento del dominio
    public updateName(newName: string ): void {
      this._name = CategoryNameVO.create(newName);
      this._updatedAt = new Date();
      this.recordEvent(new CategoryCreatedEvent(this)); // Un evento de ejemplo
    }

  // Métodos de comportamiento del dominio
    public updateDescription(newDescription: string | null): void {
      this._description = CategoryDescriptionVO.create(newDescription);
      this._updatedAt = new Date();
      this.recordEvent(new CategoryCreatedEvent(this)); // Un evento de ejemplo
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

   /**
   * Obtiene y borra los eventos de dominio registrados.
   * Este método será llamado por la capa de aplicación o infraestructura
   * después de que el agregado sea persistido o sus operaciones completadas.
   */
  public getAndClearEvents(): DomainEvent<CategoryEntity>[] {
    const events = [...this._domainEvents];
    this._domainEvents = []; // Limpiar los eventos después de haberlos obtenido
    return events;
  }

  /**
   * Registra un evento de dominio para ser despachado posteriormente.
   * @param event El evento de dominio a registrar.
   */
  private recordEvent(event: DomainEvent<CategoryEntity>): void {
    this._domainEvents.push(event);
  }
}
