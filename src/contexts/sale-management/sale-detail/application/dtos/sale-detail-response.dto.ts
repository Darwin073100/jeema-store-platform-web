import { InventoryResponseDto } from "src/contexts/inventory-management/inventory/application/dtos/inventory-response.dto";
import { ProductResponseDto } from "src/contexts/product-management/product/application/dtos/product-response.dto";
import { SaleResponseDto } from "src/contexts/sale-management/sale/application/dtos/sale-response.dto";
import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";
import { SaleForEnum } from "../../domain/enums/sale-for.enum";
import { ReturnsResponse } from "src/contexts/sale-management/returns/application/dtos/returns-response.dto";

export class SaleDetailResponseDto {
    saleDetailId: bigint;
    saleId: bigint;
    productId: bigint;
    inventoryId: bigint;

    // Datos desnormalizados del producto
    productNameAtSale: string;
    productDescriptionAtSale: string | null;
    productBarCodeAtSale: string;
    productBrandAtSale: string | null;
    productCategoryAtSale: string | null;
    productUnitAtSale: ForSaleEnum;

    // Datos de la venta
    quantity: number;
    unitPriceAtSale: number;
    regularPriceAtSale: number;
    discountItem: number;
    saleFor: SaleForEnum;
    subtotalItem: number;
    notes: string | null;

    // Relaciones
    sale: SaleResponseDto | null;
    product: ProductResponseDto | null;
    inventory: InventoryResponseDto | null;
    returns: ReturnsResponse[];

    // Campos de auditoría
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;

    constructor(
        saleDetailId: bigint,
        saleId: bigint,
        productId: bigint,
        inventoryItemId: bigint,
        productNameAtSale: string,
        productSkuAtSale: string,
        productUnitAtSale: ForSaleEnum,
        quantity: number,
        unitPriceAtSale: number,
        regularPriceAtSale: number,
        subtotalItem: number,
        discountItem: number,
        productDescriptionAtSale: string | null,
        productBrandAtSale: string | null,
        productCategoryAtSale: string | null,
        notes: string | null,
        createdAt: Date,
        updatedAt: Date | null,
        deletedAt: Date | null,
        sale: SaleResponseDto | null,
        product: ProductResponseDto | null,
        inventory: InventoryResponseDto | null,
        returns: ReturnsResponse[],
    ) {
        this.saleDetailId = saleDetailId;
        this.saleId = saleId;
        this.productId = productId;
        this.inventoryId = inventoryItemId;
        this.productNameAtSale = productNameAtSale;
        this.productBarCodeAtSale = productSkuAtSale;
        this.productUnitAtSale = productUnitAtSale;
        this.quantity = quantity;
        this.unitPriceAtSale = unitPriceAtSale;
        this.regularPriceAtSale = regularPriceAtSale;
        this.discountItem = discountItem;
        this.createdAt = createdAt;
        this.productDescriptionAtSale = productDescriptionAtSale;
        this.productBrandAtSale = productBrandAtSale;
        this.productCategoryAtSale = productCategoryAtSale;
        this.subtotalItem = subtotalItem;
        this.notes = notes;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.sale = sale;
        this.product = product;
        this.inventory = inventory;
        this.returns = returns;
    }
}