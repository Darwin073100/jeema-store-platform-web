import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";
import { SaleForEnum } from "../../domain/enums/sale-for.enum";

export class SaleDetailRegisterDto {
    saleId: bigint;
    //* Datos de la venta
    productBarCodeAtSale: string;
    productUnitAtSale: ForSaleEnum;
    quantity: number;
    saleFor: SaleForEnum;
    specialPrice?: number | null;
    notes?: string | null;

    constructor(
        saleId: bigint,
        productBarCodeAtSale: string,
        productUnitAtSale: ForSaleEnum,
        quantity: number,
        saleFor: SaleForEnum,
        specialPrice?: number | null,
        notes?: string | null,
    ) {
        this.saleId = saleId;
        this.productBarCodeAtSale = productBarCodeAtSale;
        this.productUnitAtSale = productUnitAtSale;
        this.quantity = quantity;
        this.specialPrice = specialPrice;
        this.saleFor = saleFor;
        this.notes = notes;
    }
}