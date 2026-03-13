export class RegisterTransactionDTO {
    transactionTypeId: bigint;
    branchOfficeId: bigint;
    purchaseId: bigint | null;
    saleId: bigint | null;
    employeeId: bigint;
    cashSessionId: bigint | null;
    amount: number;
    description: string | null;
}