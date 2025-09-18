export interface AddDetailToSaleHttpDto {
    quantity: number;
    unitPriceAtSale: number;
    productBarCodeAtSale: string;
    productUnitAtSale: string;
    notes?: string;
}
