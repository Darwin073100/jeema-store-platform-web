import { SaleRepository } from "src/contexts/sale-management/sale/domain/repositories/sale.repository";
import { LotRepository } from "src/contexts/purchase-management/lot/domain/repositories/lot.repository";
import { TransactionEntity } from "../../domain/entities/transaction.entity";
import { AccountTypeEnum } from "src/contexts/transaction-management/transaction-type/domain/enums/account-type.enum";
import { SaleStatusEnum } from "src/contexts/sale-management/sale/domain/enums/sale-status.enum";
import {
    EXCLUDED_INCOME_TRANSACTION_TYPE_NAMES,
    EXCLUDED_EXPENSE_TRANSACTION_TYPE_NAMES
} from "src/contexts/transaction-management/transaction-type/domain/constants/excluded-transaction-type-names.constant";
import { TransactionsFinancialSummaryResponseDTO } from "../dtos/transactions-financial-summary-response.dto";

export class GetTransactionsFinancialSummaryUseCase {
    constructor(
        private readonly saleRepository: SaleRepository,
        private readonly lotRepository: LotRepository,
    ) {}

    async execute(transactions: TransactionEntity[]): Promise<TransactionsFinancialSummaryResponseDTO> {
        // 1. Transacciones de Ingreso "reales": accountType === INCOME y nombre de tipo NO excluido
        const incomeTransactions = transactions.filter(t =>
            t.transactionType?.accountType === AccountTypeEnum.INCOME &&
            !EXCLUDED_INCOME_TRANSACTION_TYPE_NAMES.includes((t.transactionType?.name ?? '').toLowerCase())
        );

        // 2. Total de ingresos
        const totalIncomes = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);

        // 3. saleIds distintos de las transacciones de ingreso que sí tienen saleId
        const saleIds = Array.from(new Set(
            incomeTransactions
                .filter(t => t.saleId !== null)
                .map(t => t.saleId as bigint)
        ));

        // 4. Ventas asociadas, con sus saleDetails
        const sales = await this.saleRepository.findManyWithDetailsByIds(saleIds);

        // 5. Filtro defensivo: solo ventas completadas (igual que en cash)
        const completedSales = sales.filter(sale => sale.status === SaleStatusEnum.COMPLETED);

        // 6. Detalles de venta de las ventas completadas
        // NOTA: los ingresos manuales (sin saleId) cuentan en totalIncomes pero no aportan
        // aquí a totalInvested, ya que no tienen costo atribuible (misma asimetría que en cash).
        const saleDetails = completedSales.flatMap(sale => sale.saleDetails ?? []);

        // 7. Costo unitario promedio ponderado por producto (mismo algoritmo que GetCashSessionSalesSummaryUseCase)
        const productIds = Array.from(new Set(saleDetails.map(detail => detail.productId)));
        const avgUnitCostByProduct = new Map<bigint, number>();
        await Promise.all(productIds.map(async productId => {
            const lots = await this.lotRepository.findAllByProductId(productId);
            const unitsPurchased = lots.reduce((acc, lot) => acc + lot.initialQuantity, 0);
            const totalCost = lots.reduce((acc, lot) => acc + lot.purchasePrice * lot.initialQuantity, 0);
            avgUnitCostByProduct.set(productId, unitsPurchased > 0 ? totalCost / unitsPurchased : 0);
        }));

        // 8. Total invertido
        const totalInvested = saleDetails.reduce((acc, detail) => {
            const avgUnitCost = avgUnitCostByProduct.get(detail.productId) ?? 0;
            return acc + detail.quantity * avgUnitCost;
        }, 0);

        // 9. Ganancia antes de egresos
        const profitBeforeExpenses = totalIncomes - totalInvested;

        // 10. Transacciones de Egreso "reales": accountType === EXPENSE y nombre de tipo NO excluido
        const expenseTransactions = transactions.filter(t =>
            t.transactionType?.accountType === AccountTypeEnum.EXPENSE &&
            !EXCLUDED_EXPENSE_TRANSACTION_TYPE_NAMES.includes((t.transactionType?.name ?? '').toLowerCase())
        );
        const totalExpenses = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);

        // 11. Ganancia después de egresos
        const profitAfterExpenses = profitBeforeExpenses - totalExpenses;

        // 12. Márgenes, con guarda contra división por 0
        const marginBeforeExpensesPercent = totalIncomes > 0 ? (profitBeforeExpenses / totalIncomes) * 100 : 0;
        const marginAfterExpensesPercent = totalIncomes > 0 ? (profitAfterExpenses / totalIncomes) * 100 : 0;

        // 13. Cantidad de ventas completadas consideradas
        const salesCountConsidered = completedSales.length;

        return {
            totalIncomes,
            totalInvested,
            profitBeforeExpenses,
            totalExpenses,
            profitAfterExpenses,
            marginBeforeExpensesPercent,
            marginAfterExpensesPercent,
            salesCountConsidered,
        };
    }
}
