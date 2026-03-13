import { SaleDetailQuantityVO } from "../value-objects/sale-detail-quantity.vo";
import { SaleDetailRegularPriceAtSaleVO } from "../value-objects/sale-detail-regular-price-at-sale.vo";
import { SaleDetailDiscountVO } from "../value-objects/sale-detail-discount.vo";
import { SaleEntity } from "src/contexts/sale-management/sale/domain/entities/sale.entity";
import { ProductEntity } from "src/contexts/product-management/product/domain/entities/product.entity";
import { SaleDetailSubTotalVO } from "../value-objects/sale-detail-sub-total.vo";
import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";
import { SaleDetailNotesVO } from "../value-objects/sale-detail-notes.vo";
import { SaleDetailNameAtSaleVO } from "../value-objects/sale-detail-name-at-sale.vo";
import { SaleDetailBarCodeAtSaleVO } from "../value-objects/sale-detail-bar-code-at-sale.vo";
import { SaleDetailUnitPriceAtSaleVO } from "../value-objects/sale-detail-unit-price-at-sale.vo";
import { SaleDetailDescriptionAtSaleVO } from "../value-objects/sale-detail-description-at-sale.vo";
import { SaleDetailBrandAtSaleVO } from "../value-objects/sale-detail-brand-at-sale.vo";
import { SaleDetailCategoryAtSaleVO } from "../value-objects/sale-detail-category-at-sale.vo";
import { InventoryEntity } from "src/contexts/inventory-management/inventory/domain/entities/inventory.entity";
import { SaleForEnum } from "../enums/sale-for.enum";
import { ReturnsEntity } from "src/contexts/sale-management/returns/domain/entities/returns.entity";

export class SaleDetailEntity {
  private readonly _saleDetailId: bigint;
  private readonly _saleId: bigint;
  private readonly _productId: bigint;
  private readonly _inventoryId: bigint;

  // Datos desnormalizados del producto
  private readonly _productNameAtSale: SaleDetailNameAtSaleVO;
  private readonly _productDescriptionAtSale: SaleDetailDescriptionAtSaleVO;
  private readonly _productBarCodeAtSale: SaleDetailBarCodeAtSaleVO;
  private readonly _productBrandAtSale: SaleDetailBrandAtSaleVO;
  private readonly _productCategoryAtSale: SaleDetailCategoryAtSaleVO;

  // Datos de la venta
  private _productUnitAtSale: ForSaleEnum;
  private _quantity: SaleDetailQuantityVO;
  private _unitPriceAtSale: SaleDetailUnitPriceAtSaleVO;
  private _regularPriceAtSale: SaleDetailRegularPriceAtSaleVO;
  private _discountItem: SaleDetailDiscountVO;
  private _subtotalItem: SaleDetailSubTotalVO;
  private _saleFor: SaleForEnum;
  private _notes: SaleDetailNotesVO;

  // Relaciones
  private _sale: SaleEntity | null;
  private _product: ProductEntity | null;
  private _inventory: InventoryEntity | null;
  private _returns: ReturnsEntity[] | null;

  // Campos de auditoría
  private readonly _createdAt: Date;
  private _updatedAt: Date | null;
  private _deletedAt: Date | null;

  private constructor(
    saleDetailId: bigint,
    saleId: bigint,
    productId: bigint,
    inventoryItemId: bigint,
    productNameAtSale: SaleDetailNameAtSaleVO,
    productBarCodeAtSale: SaleDetailBarCodeAtSaleVO,
    productUnitAtSale: ForSaleEnum,
    quantity: SaleDetailQuantityVO,
    unitPriceAtSale: SaleDetailUnitPriceAtSaleVO,
    regularPriceAtSale: SaleDetailRegularPriceAtSaleVO,
    subtotalItem: SaleDetailSubTotalVO,
    discountItem: SaleDetailDiscountVO,
    saleFor: SaleForEnum,
    productDescriptionAtSale: SaleDetailDescriptionAtSaleVO,
    productBrandAtSale: SaleDetailBrandAtSaleVO,
    productCategoryAtSale: SaleDetailCategoryAtSaleVO,
    notes: SaleDetailNotesVO,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    sale: SaleEntity | null,
    product: ProductEntity | null,
    inventory: InventoryEntity | null,
    returns: ReturnsEntity[] | null,
  ) {
    this._saleDetailId = saleDetailId;
    this._saleId = saleId;
    this._productId = productId;
    this._inventoryId = inventoryItemId;
    this._productNameAtSale = productNameAtSale;
    this._productBarCodeAtSale = productBarCodeAtSale;
    this._productUnitAtSale = productUnitAtSale;
    this._quantity = quantity;
    this._unitPriceAtSale = unitPriceAtSale;
    this._regularPriceAtSale = regularPriceAtSale;
    this._discountItem = discountItem;
    this._createdAt = createdAt;
    this._productDescriptionAtSale = productDescriptionAtSale;
    this._productBrandAtSale = productBrandAtSale;
    this._productCategoryAtSale = productCategoryAtSale;
    this._subtotalItem = subtotalItem;
    this._saleFor = saleFor;
    this._notes = notes;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
    this._sale = sale;
    this._product = product;
    this._inventory = inventory;
    this._returns = returns;
  }

  // Getters
  get saleDetailId(): bigint {
    return this._saleDetailId;
  }

  get saleId(): bigint {
    return this._saleId;
  }

  get productId(): bigint {
    return this._productId;
  }

  get inventoryItemId(): bigint {
    return this._inventoryId;
  }

  get productNameAtSale() {
    return this._productNameAtSale.value;
  }

  get productDescriptionAtSale() {
    return this._productDescriptionAtSale.value;
  }

  get productBarCodeAtSale() {
    return this._productBarCodeAtSale.value;
  }

  get productBrandAtSale() {
    return this._productBrandAtSale.value;
  }

  get productCategoryAtSale() {
    return this._productCategoryAtSale.value;
  }

  get productUnitAtSale() {
    return this._productUnitAtSale;
  }

  public updateProductUnitAtSale(unit: ForSaleEnum): void {
    this._productUnitAtSale = unit;
  }

  get quantity() {
    return this._quantity.value;
  }

  get saleFor() {
    return this._saleFor;
  }

  public updateSaleFor(saleFor: SaleForEnum) {
    this._saleFor = saleFor;
  }

  public updateQuantity(quantity: number): void {
    this._quantity = SaleDetailQuantityVO.create(quantity);
  }

  get unitPriceAtSale() {
    return this._unitPriceAtSale.value;
  }

  public updateUnitPriceAtSale(unitPriceAtSale: number): void {
    this._unitPriceAtSale = SaleDetailUnitPriceAtSaleVO.create(unitPriceAtSale);
  }

  get regularPriceAtSale() {
    return this._regularPriceAtSale.value;
  }

  public updateRegularPriceAtSale(regularPriceAtSale: number): void {
    this._regularPriceAtSale = SaleDetailRegularPriceAtSaleVO.create(regularPriceAtSale);
  }

  get discountItem() {
    return this._discountItem.value;
  }

  public updateSaleDetailDiscount(discountItem: number): void {
    this._discountItem = SaleDetailDiscountVO.create(discountItem);
  }

  get subtotalItem() {
    return this._subtotalItem.value;
  }

  public updateSaleDetailSubTotal(subtotalItem: number): void {
    this._subtotalItem = SaleDetailSubTotalVO.create(subtotalItem);
  }

  get notes() {
    return this._notes.value;
  }

  public updateNotes(notes: string | null): void {
    this._notes = SaleDetailNotesVO.create(notes);
  }

  get sale(): SaleEntity | null {
    return this._sale;
  }

  get product(): ProductEntity | null {
    return this._product;
  }

  get inventory(): InventoryEntity | null {
    return this._inventory;
  }
  get returns(){
    return this._returns;
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

  public static create(
    saleId: bigint,
    productId: bigint,
    inventoryItemId: bigint,
    productNameAtSale: string,
    productBarCodeAtSale: string,
    productUnitAtSale: ForSaleEnum,
    quantity: number,
    unitPriceAtSale: number,
    regularPriceAtSale: number,
    subtotalItem: number,
    discountItem: number,
    saleFor: SaleForEnum,
    productDescriptionAtSale: string | null,
    productBrandAtSale: string | null,
    productCategoryAtSale: string | null,
    notes: string | null,
  ): SaleDetailEntity {
    const saleDetail = new SaleDetailEntity(
      BigInt(0), // Generar un ID único (esto es solo un ejemplo, en un entorno real usarías un generador de IDs adecuado)
      saleId,
      productId,
      inventoryItemId,
      SaleDetailNameAtSaleVO.create(productNameAtSale),
      SaleDetailBarCodeAtSaleVO.create(productBarCodeAtSale),
      productUnitAtSale,
      SaleDetailQuantityVO.create(quantity),
      SaleDetailUnitPriceAtSaleVO.create(unitPriceAtSale),
      SaleDetailRegularPriceAtSaleVO.create(regularPriceAtSale),
      SaleDetailSubTotalVO.create(subtotalItem),
      SaleDetailDiscountVO.create(discountItem),
      saleFor,
      SaleDetailDescriptionAtSaleVO.create(productDescriptionAtSale),
      SaleDetailBrandAtSaleVO.create(productBrandAtSale),
      SaleDetailCategoryAtSaleVO.create(productCategoryAtSale),
      SaleDetailNotesVO.create(notes),
      new Date(),
      null,
      null,
      null,
      null,
      null,
      null
    );

    return saleDetail;
  }

  public static reconstitute(
    saleDetailId: bigint,
    saleId: bigint,
    productId: bigint,
    inventoryItemId: bigint,
    productNameAtSale: string,
    productBarCodeAtSale: string,
    productUnitAtSale: ForSaleEnum,
    quantity: number,
    unitPriceAtSale: number,
    regularPriceAtSale: number,
    subtotalItem: number,
    discountItem: number,
    saleFor: SaleForEnum,
    productDescriptionAtSale: string | null,
    productBrandAtSale: string | null,
    productCategoryAtSale: string | null,
    notes: string | null,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    sale: SaleEntity | null,
    product: ProductEntity | null,
    inventory: InventoryEntity | null,
    returns: ReturnsEntity[] | null,
  ): SaleDetailEntity {
    return new SaleDetailEntity(
      saleDetailId,
      saleId,
      productId,
      inventoryItemId,
      SaleDetailNameAtSaleVO.create(productNameAtSale),
      SaleDetailBarCodeAtSaleVO.create(productBarCodeAtSale),
      productUnitAtSale,
      SaleDetailQuantityVO.create(quantity),
      SaleDetailUnitPriceAtSaleVO.create(unitPriceAtSale),
      SaleDetailRegularPriceAtSaleVO.create(regularPriceAtSale),
      SaleDetailSubTotalVO.create(subtotalItem),
      SaleDetailDiscountVO.create(discountItem),
      saleFor,
      SaleDetailDescriptionAtSaleVO.create(productDescriptionAtSale),
      SaleDetailBrandAtSaleVO.create(productBrandAtSale),
      SaleDetailCategoryAtSaleVO.create(productCategoryAtSale),
      SaleDetailNotesVO.create(notes),
      createdAt,
      updatedAt,
      deletedAt,
      sale,
      product,
      inventory,
      returns
    );
  }
}
