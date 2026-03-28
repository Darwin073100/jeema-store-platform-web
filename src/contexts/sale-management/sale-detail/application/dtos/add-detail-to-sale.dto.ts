import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";
import { SaleForEnum } from "../../domain/enums/sale-for.enum";

export interface AddDetailToSaleDto {
    saleId: bigint;
    quantity: number;
    specialPrice?: number | null;
    productBarCodeAtSale: string;
    productUnitAtSale: ForSaleEnum;
    saleFor: SaleForEnum;
    notes?: string | null;
}