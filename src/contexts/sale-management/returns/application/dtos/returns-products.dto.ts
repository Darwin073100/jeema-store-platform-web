interface Products {
    saleDetailId: bigint;
    inventoryId: bigint;
    amountReturn: number;
    quantityReturn: number;
    notes: string | null;
}

export interface ReturnsProductsDTO {
    branchOfficeId: bigint;
    employeeId: bigint;
    cashSessionId: bigint;
    saleId: bigint;
    products: Products[]
}