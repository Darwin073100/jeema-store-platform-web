import { DomainEvent } from 'src/shared/domain/events/domain-events';
import { ForSaleEnum } from '../../../../../shared/domain/enums/for-sale.enum';
import { ProductNameVO } from '../value-objects/product-name.vo';
import { ProductDescriptionVO } from '../value-objects/product-description.vo';
import { ProductSkuVO } from '../value-objects/product-sku.vo';
import { ProductUniversalBarCodeVO } from '../value-objects/product-universal-bar-code.vo';
import { EstablishmentEntity } from 'src/contexts/establishment-management/establishment/domain/entities/establishment.entity';
import { CategoryEntity } from 'src/contexts/product-management/category/domain/entities/category-entity';
import { BrandEntity } from 'src/contexts/product-management/brand/domain/entities/brand.entity';
import { SeasonEntity } from 'src/contexts/product-management/season/domain/entities/season.entity';
import { LotEntity } from 'src/contexts/purchase-management/lot/domain/entities/lot.entity';
import { InventoryEntity } from 'src/contexts/inventory-management/inventory/domain/entities/inventory.entity';
import { SaleDetailEntity } from 'src/contexts/sale-management/sale-detail/domain/entities/sale-detail.entity';

export class ProductEntity {
  private readonly _productId: bigint;
  private readonly _establishmentId: bigint;
  private readonly _categoryId: bigint;
  private readonly _brandId: bigint | null;
  private readonly _seasonId: bigint | null;
  private _name: ProductNameVO;
  private _sku: ProductSkuVO;
  private _universalBarCode: ProductUniversalBarCodeVO;
  private _description: ProductDescriptionVO;
  private _unitOfMeasure: ForSaleEnum;
  private _minStockGlobal: number;
  private _imageUrl: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date | null;
  private _deletedAt: Date | null;
  private _domainEvents: DomainEvent<ProductEntity>[] = [];

  private _establishment?: EstablishmentEntity | null;
  private _category?: CategoryEntity | null;
  private _brand?: BrandEntity | null;
  private _season?: SeasonEntity | null;
  private _lots?: LotEntity[] | null;
  private _inventory?: InventoryEntity|null;
  private _saleDetails?: SaleDetailEntity[]|null;

  private constructor(
    productId: bigint,
    establishmentId: bigint,
    categoryId: bigint,
    brandId: bigint | null,
    seasonId: bigint | null,
    name: ProductNameVO,
    sku: ProductSkuVO,
    universalBarCode: ProductUniversalBarCodeVO,
    description: ProductDescriptionVO,
    unitOfMeasure: ForSaleEnum,
    minStockGlobal: number,
    imageUrl: string | null,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    establishment?: EstablishmentEntity | null,
    category?: CategoryEntity | null,
    brand?: BrandEntity | null,
    season?: SeasonEntity | null,
    lots?: LotEntity[] | null,
    inventory?: InventoryEntity|null,
    saleDetails?: SaleDetailEntity[]|null,
  ) {
    this._productId = productId;
    this._establishmentId = establishmentId;
    this._categoryId = categoryId;
    this._brandId = brandId;
    this._seasonId = seasonId;
    this._name = name;
    this._sku = sku;
    this._universalBarCode = universalBarCode;
    this._description = description;
    this._unitOfMeasure = unitOfMeasure;
    this._minStockGlobal = minStockGlobal;
    this._imageUrl = imageUrl;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
    this._establishment = establishment ?? null;
    this._category = category ?? null;
    this._brand = brand ?? null;
    this._season = season ?? null;
    this._lots = lots ?? null;
    this._inventory = inventory ?? null;
    this._saleDetails = saleDetails ?? null;
  }

  static create(
    productId: bigint,
    establishmentId: bigint,
    categoryId: bigint,
    brandId: bigint | null,
    seasonId: bigint | null,
    name: ProductNameVO,
    sku: ProductSkuVO,
    universalBarCode: ProductUniversalBarCodeVO,
    description: ProductDescriptionVO,
    unitOfMeasure: ForSaleEnum,
    minStockGlobal: number,
    imageUrl: string | null,
  ): ProductEntity {
    const now = new Date();
    return new ProductEntity(
      productId,
      establishmentId,
      categoryId,
      brandId,
      seasonId,
      name,
      sku,
      universalBarCode,
      description,
      unitOfMeasure,
      minStockGlobal,
      imageUrl,
      now,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
  }

  static reconstitute(
    productId: bigint,
    establishmentId: bigint,
    categoryId: bigint,
    brandId: bigint | null,
    seasonId: bigint | null,
    name: ProductNameVO,
    sku: ProductSkuVO,
    universalBarCode: ProductUniversalBarCodeVO,
    description: ProductDescriptionVO,
    unitOfMeasure: ForSaleEnum,
    minStockGlobal: number,
    imageUrl: string | null,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    establishment?: EstablishmentEntity | null,
    category?: CategoryEntity | null,
    brand?: BrandEntity | null,
    season?: SeasonEntity | null,
    lots?: LotEntity[] | null,
    inventory?: InventoryEntity|null,
    saleDetails?: SaleDetailEntity[]|null,
  ): ProductEntity {
    return new ProductEntity(
      productId,
      establishmentId,
      categoryId,
      brandId,
      seasonId,
      name,
      sku,
      universalBarCode,
      description,
      unitOfMeasure,
      minStockGlobal,
      imageUrl,
      createdAt,
      updatedAt,
      deletedAt,
      establishment ?? null,
      category ?? null,
      brand ?? null,
      season ?? null,
      lots ?? null,
      inventory ?? null,
      saleDetails ?? null,
    );
  }

  // Getters
  get productId(): bigint {
    return this._productId;
  }
  get establishmentId(): bigint {
    return this._establishmentId;
  }
  get categoryId(): bigint {
    return this._categoryId;
  }
  get brandId(): bigint | null {
    return this._brandId;
  }
  get seasonId(): bigint | null {
    return this._seasonId;
  }
  get name(): ProductNameVO {
    return this._name;
  }
  get sku(): ProductSkuVO {
    return this._sku;
  }
  get universalBarCode(): ProductUniversalBarCodeVO {
    return this._universalBarCode;
  }
  get description(): ProductDescriptionVO {
    return this._description;
  }
  get unitOfMeasure(): ForSaleEnum {
    return this._unitOfMeasure;
  }
  get minStockGlobal(): number {
    return this._minStockGlobal;
  }
  get imageUrl(): string | null {
    return this._imageUrl;
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

  // Getters para las relaciones
  get establishment(): EstablishmentEntity | null | undefined {
    return this._establishment;
  }
  get category(): CategoryEntity | null | undefined {
    return this._category;
  }
  get brand(): BrandEntity | null | undefined {
    return this._brand;
  }
  get season(): SeasonEntity | null | undefined {
    return this._season;
  }
  get lots(): LotEntity[] | null | undefined {
    return this._lots;
  }
  get inventory(): InventoryEntity | null | undefined {
    return this._inventory;
  }
  get saleDetails(): SaleDetailEntity[] | null | undefined {
    return this._saleDetails;
  }

  // Métodos de comportamiento del dominio
  public updateName(newName: ProductNameVO): void {
    if (this._name.value === newName.value) return;
    this._name = newName;
    this._updatedAt = new Date();
  }

  public updateDescription(newDescription: ProductDescriptionVO): void {
    if (this._description.value === newDescription.value) return;
    this._description = newDescription;
    this._updatedAt = new Date();
  }

  public updateSku(newSku: ProductSkuVO): void {
    if (this._sku.value === newSku.value) return;
    this._sku = newSku;
    this._updatedAt = new Date();
  }

  public updateUniversalBarCode(newBarCode: ProductUniversalBarCodeVO): void {
    if (this._universalBarCode.value === newBarCode.value) return;
    this._universalBarCode = newBarCode;
    this._updatedAt = new Date();
  }

  public updateUnitOfMeasure(newUnit: ForSaleEnum): void {
    if (this._unitOfMeasure === newUnit) return;
    this._unitOfMeasure = newUnit;
    this._updatedAt = new Date();
  }

  public updateMinStockGlobal(newMinStock: number): void {
    if (this._minStockGlobal === newMinStock) return;
    this._minStockGlobal = newMinStock;
    this._updatedAt = new Date();
  }

  public updateImageUrl(newUrl: string | null): void {
    if (this._imageUrl === newUrl) return;
    this._imageUrl = newUrl;
    this._updatedAt = new Date();
  }

  public softDelete(): void {
    if (this._deletedAt) return;
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  public restore(): void {
    if (!this._deletedAt) return;
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  public getAndClearEvents(): DomainEvent<ProductEntity>[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }

  private recordEvent(event: DomainEvent<ProductEntity>): void {
    this._domainEvents.push(event);
  }
}
