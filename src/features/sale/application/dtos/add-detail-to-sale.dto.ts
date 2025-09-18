export interface AddDetailToSaleDto {
    quantity: number;
    unitPriceAtSale: number;
    productBarCodeAtSale: string;
    productUnitAtSale: string;
    notes?: string;
}
