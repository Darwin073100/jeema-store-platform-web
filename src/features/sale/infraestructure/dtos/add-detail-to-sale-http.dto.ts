import { SaleForEnum } from "../../../../contexts/sale-management/sale/domain/enums/sale-for.enum";

export interface AddDetailToSaleHttpDto {
    quantity: number;
    specialPrice?: number|null;
    productBarCodeAtSale: string;
    productUnitAtSale: string;
    saleFor: SaleForEnum;
    notes?: string;
}
