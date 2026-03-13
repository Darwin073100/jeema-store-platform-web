export class ManyFilterTransactionsDTO{
    establishmentId: bigint;
    dateInit: Date | null;
    dateEnd: Date | null;
    branchOfficeId: bigint | null;
    employeeId: bigint | null;
    cashSessionId: bigint | null;
    saleId: bigint | null;
    transactionType: string | null;
}