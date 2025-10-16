export interface RegisterTransactionDTO{
    transactionTypeId : bigint;
    branchOfficeId    : bigint;
    purchaseId        : bigint | null;
    saleId            : bigint | null;
    employeeId        : bigint;
    amount            : number;
    description       : string | null;
}