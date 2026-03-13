/**
 * Entidad de Dominio: Producto
 * Contiene toda la lógica de negocio pura del producto
 * Esta clase NO es una entidad ORM, es un POJO que representa el concepto de Producto
 */

import { ForSaleEnum } from '@/shared/domain/enums/for-sale.enum';
import { ProductNameVO } from '../value-objects/product-name.vo';
import { ProductDescriptionVO } from '../value-objects/product-description.vo';
import { ProductSkuVO } from '../value-objects/product-sku.vo';
import { ProductUniversalBarCodeVO } from '../value-objects/product-universal-bar-code.vo';

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
    deletedAt: Date | null
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
  }

  /**
   * Crea un nuevo Producto (factory method)
   */
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
    imageUrl: string | null
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
      null
    );
  }

  /**
   * Reconstituye un Producto existente desde la persistencia (reconstitution pattern)
   */
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
    deletedAt: Date | null
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
      deletedAt
    );
  }

  // ================== Getters ==================

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

  // ================== Métodos de Comportamiento ==================

  /**
   * Actualiza el nombre del producto
   */
  public updateName(newName: ProductNameVO): void {
    if (this._name.value === newName.value) return;
    this._name = newName;
    this._updatedAt = new Date();
  }

  /**
   * Actualiza la descripción del producto
   */
  public updateDescription(newDescription: ProductDescriptionVO): void {
    if (this._description.value === newDescription.value) return;
    this._description = newDescription;
    this._updatedAt = new Date();
  }

  /**
   * Actualiza el SKU del producto
   */
  public updateSku(newSku: ProductSkuVO): void {
    if (this._sku.value === newSku.value) return;
    this._sku = newSku;
    this._updatedAt = new Date();
  }

  /**
   * Actualiza el código de barras universal
   */
  public updateUniversalBarCode(newBarCode: ProductUniversalBarCodeVO): void {
    if (this._universalBarCode.value === newBarCode.value) return;
    this._universalBarCode = newBarCode;
    this._updatedAt = new Date();
  }

  /**
   * Actualiza la unidad de medida
   */
  public updateUnitOfMeasure(newUnit: ForSaleEnum): void {
    if (this._unitOfMeasure === newUnit) return;
    this._unitOfMeasure = newUnit;
    this._updatedAt = new Date();
  }

  /**
   * Actualiza el stock mínimo global
   */
  public updateMinStockGlobal(newMinStock: number): void {
    if (this._minStockGlobal === newMinStock) return;
    this._minStockGlobal = newMinStock;
    this._updatedAt = new Date();
  }

  /**
   * Actualiza la URL de la imagen
   */
  public updateImageUrl(newUrl: string | null): void {
    if (this._imageUrl === newUrl) return;
    this._imageUrl = newUrl;
    this._updatedAt = new Date();
  }

  /**
   * Realiza un soft delete (marca como eliminado sin borrar datos)
   */
  public softDelete(): void {
    if (this._deletedAt) return;
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  /**
   * Restaura un producto eliminado
   */
  public restore(): void {
    if (!this._deletedAt) return;
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  /**
   * Verifica si el producto está eliminado
   */
  public isDeleted(): boolean {
    return this._deletedAt !== null;
  }
}
