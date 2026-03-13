export class RegisterTransactionSaleDTO{
    transactionTypeId : bigint;
    branchOfficeId    : bigint;
    saleId            : bigint | null;
    employeeId        : bigint;
    amount            : number;
    description       : string | null;
}