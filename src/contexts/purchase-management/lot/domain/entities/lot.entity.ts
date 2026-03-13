import { DomainEvent } from 'src/shared/domain/events/domain-events';
import { LotNumberVO } from '../value-objects/lot-number.vo';
import { PurchasePriceVO } from '../value-objects/purchase-price.vo';
import { InitialQuantityVO } from '../value-objects/initial-quantity.vo';
import { ExpirationDateVO } from '../value-objects/expiration-date.vo';
import { ManufacturingDateVO } from '../value-objects/manufacturing-date.vo';
import { ReceivedDateVO } from '../value-objects/received-date.vo';
import { ProductEntity } from 'src/contexts/product-management/product/domain/entities/product.entity';
import { LotUnitPurchaseEntity } from './lot-unit-purchase.entity';
import { ForSaleEnum } from 'src/shared/domain/enums/for-sale.enum';
import { SuplierEntity } from 'src/contexts/purchase-management/suplier/domain/entities/suplier.entity';

export class LotEntity {
  private readonly _lotId: bigint;
  private _productId: bigint;
  private _suplierId: bigint | null;
  private _lotNumber: LotNumberVO;
  private _purchasePrice: PurchasePriceVO;
  private _initialQuantity: InitialQuantityVO;
  private _purchaseUnit: ForSaleEnum;
  private _expirationDate: ExpirationDateVO | null;
  private _manufacturingDate: ManufacturingDateVO | null;
  private readonly _receivedDate: ReceivedDateVO;
  private readonly _createdAt: Date;
  private _updatedAt: Date | null;
  private _deletedAt: Date | null;

  private _product: ProductEntity | null;
  private _lotUnitPurchases: LotUnitPurchaseEntity[] | null;
  private _suplier: SuplierEntity | null;

  private constructor(
    lotId: bigint,
    productId: bigint,
    suplierId: bigint | null,
    lotNumber: LotNumberVO,
    purchasePrice: PurchasePriceVO,
    initialQuantity: InitialQuantityVO,
    purchaseUnit: ForSaleEnum,
    receivedDate: ReceivedDateVO,
    expirationDate: ExpirationDateVO | null,
    manufacturingDate: ManufacturingDateVO | null,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    product: ProductEntity | null,
    lotUnitPurchases: LotUnitPurchaseEntity[] | null,
    suplier: SuplierEntity | null,
  ) {
    this._lotId = lotId;
    this._productId = productId;
    this._suplierId = suplierId;
    this._lotNumber = lotNumber;
    this._purchasePrice = purchasePrice;
    this._initialQuantity = initialQuantity;
    this._purchaseUnit = purchaseUnit;
    this._expirationDate = expirationDate;
    this._manufacturingDate = manufacturingDate;
    this._receivedDate = receivedDate;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
    this._product = product ?? null;
    this._lotUnitPurchases = lotUnitPurchases ?? null;
    this._suplier = suplier ?? null;
  }

  static create(
    lotId: bigint,
    productId: bigint,
    suplierId: bigint | null,
    lotNumber: string,
    purchasePrice: number,
    initialQuantity: number,
    purchaseUnit: ForSaleEnum,
    receivedDate: Date,
    expirationDate: Date | null,
    manufacturingDate: Date | null,
  ): LotEntity {
    return new LotEntity(
      lotId,
      productId,
      suplierId,
      LotNumberVO.create(lotNumber),
      PurchasePriceVO.create(purchasePrice),
      InitialQuantityVO.create(initialQuantity),
      purchaseUnit,
      ReceivedDateVO.create(receivedDate),
      ExpirationDateVO.create(expirationDate),
      ManufacturingDateVO.create(manufacturingDate),
      new Date(),
      null,
      null,
      null,
      null,
      null,
    );
  }

  static reconstitute(
    lotId: bigint,
    productId: bigint,
    suplierId: bigint | null,
    lotNumber: string,
    purchasePrice: number,
    initialQuantity: number,
    purchaseUnit: ForSaleEnum,
    receivedDate: Date,
    expirationDate: Date | null,
    manufacturingDate: Date | null,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    product: ProductEntity | null,
    lotUnitPurchases: LotUnitPurchaseEntity[] | null,
    suplier: SuplierEntity | null,
  ): LotEntity {
    return new LotEntity(
      lotId,
      productId,
      suplierId,
      LotNumberVO.create(lotNumber),
      PurchasePriceVO.create(purchasePrice),
      InitialQuantityVO.create(initialQuantity),
      purchaseUnit,
      ReceivedDateVO.create(receivedDate),
      ExpirationDateVO.create(expirationDate),
      ManufacturingDateVO.create(manufacturingDate),
      createdAt,
      updatedAt,
      deletedAt,
      product,
      lotUnitPurchases,
      suplier
    );
  }

  // Getters
  get lotId(): bigint { return this._lotId; }
  get productId(): bigint { return this._productId; }
  get suplierId(): bigint | null { return this._suplierId; }
  get lotNumber(): string { return this._lotNumber.value; }
  get purchasePrice():number { return this._purchasePrice.value; }
  get initialQuantity(): number{ return this._initialQuantity.value; }
  get purchaseUnit(): ForSaleEnum { return this._purchaseUnit; }
  get expirationDate(): Date | null { return this._expirationDate?.value ?? null; }
  get manufacturingDate(): Date | null { return this._manufacturingDate?.value ?? null; }
  get receivedDate(): Date { return this._receivedDate.value; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date | null { return this._updatedAt; }
  get deletedAt(): Date | null { return this._deletedAt; }
  get product(): ProductEntity | null { return this._product; }
  get lotUnitPurchases(): LotUnitPurchaseEntity[] | null { return this._lotUnitPurchases; }
  get suplier(): SuplierEntity | null { return this._suplier; }

  // Métodos de dominio
  public updateSuplierId(changeSuplierId: bigint | null){
    this._suplierId = changeSuplierId;
    this._updatedAt = new Date();
  }
  public updateLotNumber(newLotNumber: LotNumberVO): void {
    if (this._lotNumber.value === newLotNumber.value) return;
    this._lotNumber = newLotNumber;
    this._updatedAt = new Date();
  }

  public updatePurchasePrice(newPrice: PurchasePriceVO): void {
    if (this._purchasePrice.value === newPrice.value) return;
    this._purchasePrice = newPrice;
    this._updatedAt = new Date();
  }

  public updateInitialQuantity(newQuantity: InitialQuantityVO): void {
    if (this._initialQuantity.value === newQuantity.value) return;
    this._initialQuantity = newQuantity;
    this._updatedAt = new Date();
  }

  public updateExpirationDate(newDate: ExpirationDateVO): void {
    if (newDate) {
      if (this._expirationDate?.value?.getTime() === newDate.value?.getTime()) return;
      this._expirationDate = newDate;
      this._updatedAt = new Date();
    } 
  }

  public updateManufacturingDate(newDate: ManufacturingDateVO): void {
    if (newDate){
      if (this._manufacturingDate?.value?.getTime() === newDate.value?.getTime()) return;
      this._manufacturingDate = newDate;
      this._updatedAt = new Date();
    }
  }
}
