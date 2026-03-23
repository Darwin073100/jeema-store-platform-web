import { SaleForEnum } from "../../../../contexts/sale-management/sale/domain/enums/sale-for.enum";

export interface AddDetailToSaleDto {
    quantity: number;
    specialprice?: number | null;
    productBarCodeAtSale: string;
    productUnitAtSale: string;
    saleFor: SaleForEnum
    notes?: string;
}
