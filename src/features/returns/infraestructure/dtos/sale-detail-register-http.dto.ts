interface Products {
    saleDetailId: string;
    inventoryId: string;
    amountReturn: number;
    quantityReturn: number;
    notes?: string;
}

export interface ReturnsProductsHttpDTO {
    branchOfficeId: string;
    employeeId: string;
    cashSessionId: string;
    saleId: string;
    products: Products[]
}