export interface RegisterTransactionHttpDTO{
    transactionTypeId : string;
    branchOfficeId    : string;
    purchaseId        ?: string | null;
    saleId            ?: string | null;
    cashSessionId     ?: string | null;
    employeeId        : string;
    amount            : number;
    description       : string | null;
}