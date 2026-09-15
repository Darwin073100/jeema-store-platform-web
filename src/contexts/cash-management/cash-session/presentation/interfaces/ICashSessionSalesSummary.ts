export interface ICashSessionSalesSummary {
    cashSessionId: bigint;
    salesCount: number;
    grossSales: number;
    returnsAmount: number;
    totalSales: number;
    totalInvested: number;
    profit: number;
    marginPercent: number;
}
