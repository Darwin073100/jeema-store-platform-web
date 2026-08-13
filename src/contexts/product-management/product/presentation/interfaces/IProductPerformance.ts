export interface IProductPerformance {
  productId: bigint;
  dateInit: Date | null;
  dateFinish: Date | null;
  sales: {
    unitsSold: number;
    unitsReturned: number;
    netUnitsSold: number;
    grossRevenue: number;
    returnsAmount: number;
    netRevenue: number;
    lastSaleDate: Date | null;
  };
  purchases: {
    unitsPurchased: number;
    totalCost: number;
    avgUnitCost: number;
    lastPurchaseDate: Date | null;
  };
  profit: {
    estimatedCOGS: number;
    grossProfit: number;
    marginPercent: number;
  };
  inventory: {
    currentStockTotal: number;
    currentStockSaleValue: number;
    currentStockCostValue: number;
  };
}
