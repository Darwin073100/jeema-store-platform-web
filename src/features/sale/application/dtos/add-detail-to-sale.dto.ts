import { SaleForEnum } from "../../domain/enums/sale-for.enum";

export interface AddDetailToSaleDto {
    quantity: number;
    specialprice?: number | null;
    productBarCodeAtSale: string;
    productUnitAtSale: string;
    saleFor: SaleForEnum
    notes?: string;
}
