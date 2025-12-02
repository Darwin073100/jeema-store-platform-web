export interface ManyFilterTransactionsHttpDTO{
    establishmentId: string;
    dateInit: string | undefined;
    dateEnd: string | undefined;
    branchOfficeId: string | undefined;
    employeeId: string | undefined;
    cashSessionId: string | undefined;
    saleId: string | undefined;
    transactionType: string | undefined;
}