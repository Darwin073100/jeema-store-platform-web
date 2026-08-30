export interface TransactionsFinancialSummaryResponseDTO {
    totalIncomes: number;
    totalInvested: number;
    profitBeforeExpenses: number;
    totalExpenses: number;
    profitAfterExpenses: number;
    marginBeforeExpensesPercent: number;
    marginAfterExpensesPercent: number;
    salesCountConsidered: number;
}
