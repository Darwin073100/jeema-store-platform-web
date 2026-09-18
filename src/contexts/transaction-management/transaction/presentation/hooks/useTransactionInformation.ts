import { useTransactionStore } from "../stores/transaction.store";

export const useTransactionInformation = () => {
    const { financialSummary } = useTransactionStore();
    
        const returnsAmount = financialSummary?.returnsAmount ?? 0;
        const totalIncomes = financialSummary?.totalIncomes ?? 0;
        const hasReturns = returnsAmount > 0;
        const totalInvested = financialSummary?.totalInvested ?? 0;
        const profitBeforeExpenses = financialSummary?.profitBeforeExpenses ?? 0;
        const totalExpenses = financialSummary?.totalExpenses ?? 0;
        const profitAfterExpenses = financialSummary?.profitAfterExpenses ?? 0;
        const marginBeforeExpensesPercent = financialSummary?.marginBeforeExpensesPercent ?? 0;
        const marginAfterExpensesPercent = financialSummary?.marginAfterExpensesPercent ?? 0;
        const salesCountConsidered = financialSummary?.salesCountConsidered ?? 0;
        const isProfitAfterExpenses = profitAfterExpenses >= 0;
  return {
    returnsAmount,
    totalIncomes,
    hasReturns,
    totalInvested,
    profitBeforeExpenses,
    totalExpenses,
    profitAfterExpenses,
    marginBeforeExpensesPercent,
    marginAfterExpensesPercent,
    salesCountConsidered,
    isProfitAfterExpenses
  }
}
