import { ProductEntity } from "@/features/product/domain/entities/product.entity";
import { SaleEntity } from "./sale-entity";
import { InventoryEntity } from "@/features/inventory/domain/entities/inventory.entity";
import { ForSaleEnum } from "@/features/product/domain/enums/for-sale.enum";

export interface SaleDetailEntity {
    saleDetailId: bigint;
    saleId: bigint;
    productId: bigint;
    inventoryId: bigint;

    // Datos desnormalizados del producto
    productNameAtSale: string;
    productDescriptionAtSale?: string | null;
    productBarCodeAtSale: string;
    productBrandAtSale?: string | null;
    productCategoryAtSale?: string | null;
    productUnitAtSale: ForSaleEnum;

    // Datos de la venta
    quantity: number;
    unitPriceAtSale: number;
    regularPriceAtSale: number;
    discountItem: number;
    subtotalItem: number;
    notes?: string | null;

    // Relaciones
    sale?: SaleEntity | null;
    product?: ProductEntity | null;
    inventory?: InventoryEntity | null;

    // Campos de auditoría
    createdAt: Date;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
}