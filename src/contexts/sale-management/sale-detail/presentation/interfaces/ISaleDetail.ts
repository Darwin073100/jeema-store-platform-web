import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";
import { SaleForEnum } from "../../domain/enums/sale-for.enum";
import { IProduct } from "@/contexts/product-management/product/presentation/interfaces/IProduct";
import { IInventory } from "@/contexts/inventory-management/inventory/presentation/interfaces/IInventory";
import { IReturns } from "@/contexts/sale-management/returns/presentation/interfaces/IReturns";
import { ISale } from "@/contexts/sale-management/sale/presentation/interfaces/ISale";

export interface ISaleDetail {
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
    sale: ISale | null;
    product: IProduct | null;
    inventory: IInventory | null;
    returns: IReturns[];

    // Campos de auditoría
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}