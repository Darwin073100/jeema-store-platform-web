import { SeasonNameVO } from '../value-objects/season-name.vo';
import { SeasonDescriptionVO } from '../value-objects/season-description.vo';
import { DomainEvent } from 'src/shared/domain/events/domain-events';
import { ProductEntity } from 'src/contexts/product-management/product/domain/entities/product.entity';
import { EstablishmentEntity } from 'src/contexts/establishment-management/establishment/domain/entities/establishment.entity';

export class SeasonEntity {
  private readonly _seasonId: bigint;
  private _name: SeasonNameVO;
  private _establishmentId: bigint;
  private _description: SeasonDescriptionVO | null;
  private _dateInit: Date | null;
  private _dateFinish: Date | null;
  private readonly _createdAt: Date;
  private _deletedAt: Date | null;
  private _updatedAt: Date | null;
  private _products: ProductEntity[] | null;
  private _establishment: EstablishmentEntity | null;

  private constructor(
    seasonId: bigint,
    establishmentId: bigint,
    name: string,
    description: string | null,
    dateInit: Date | null,
    dateFinish: Date | null,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    products: ProductEntity[] | null,
    establishment: EstablishmentEntity | null,
  ) {
    this._seasonId = seasonId;
    this._establishmentId = establishmentId;
    this._name = SeasonNameVO.create(name);
    this._description = SeasonDescriptionVO.create(description);
    this._dateInit = dateInit;
    this._dateFinish = dateFinish;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt ?? null;
    this._deletedAt = deletedAt ?? null;
    this._products = products ?? null;
    this._establishment = establishment ?? null;
  }

  static create(
    establishmentId: bigint,
    name: string,
    description: string | null,
    dateInit: Date | null,
    dateFinish: Date | null,
  ): SeasonEntity {
    return new SeasonEntity(
      BigInt(0),
      establishmentId,
      name,
      description,
      dateInit,
      dateFinish,
      new Date(),
      null,
      null,
      null, // productos siempre undefined/null en create
      null,
    );
  }

  static reconstitute(
    seasonId: bigint,
    establishmentId: bigint,
    name: string,
    description: string | null,
    dateInit: Date | null,
    dateFinish: Date | null,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    products: ProductEntity[] | null,
    establishment: EstablishmentEntity | null,
  ): SeasonEntity {
    return new SeasonEntity(
      seasonId,
      establishmentId,
      name,
      description,
      dateInit,
      dateFinish,
      createdAt,
      updatedAt,
      deletedAt,
      products,
      establishment,
    );
  }
  get establishmentId(){ return this._establishmentId; };
  get seasonId() { return this._seasonId; }
  get name() { return this._name.value; }
  get description() { return this._description?.value ?? null; }
  get dateInit() { return this._dateInit; }
  get dateFinish() { return this._dateFinish; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }
  get deletedAt() { return this._deletedAt; }
  get products() { return this._products; }
  get establishment() { return this._establishment; };

  updateName(name: string): void {
      this._name = SeasonNameVO.create(name);
      this._updatedAt = new Date();
  }

  updateDescription(description: string | null): void {
    if (this._description !== description) {
      this._description = SeasonDescriptionVO.create(description);
      this._updatedAt = new Date();
    }
  }

  updateDateInit(dateInit: Date | null): void {
    if (this._dateInit !== dateInit) {
      this._dateInit = dateInit;
      this._updatedAt = new Date();
    }
  }

  updateDateFinish(dateFinish: Date | null): void {
    if (this._dateFinish !== dateFinish) {
      this._dateFinish = dateFinish;
      this._updatedAt = new Date();
    }
  }
}
