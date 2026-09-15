import { SaleRepository } from "src/contexts/sale-management/sale/domain/repositories/sale.repository";
import { TransactionEntity } from "../../domain/entities/transaction.entity";
import { AccountTypeEnum } from "src/contexts/transaction-management/transaction-type/domain/enums/account-type.enum";
import { SaleStatusEnum } from "src/contexts/sale-management/sale/domain/enums/sale-status.enum";
import {
    EXCLUDED_INCOME_TRANSACTION_TYPE_NAMES,
    EXCLUDED_EXPENSE_TRANSACTION_TYPE_NAMES,
    RETURN_TRANSACTION_TYPE_NAMES
} from "src/contexts/transaction-management/transaction-type/domain/constants/excluded-transaction-type-names.constant";
import { TransactionsFinancialSummaryResponseDTO } from "../dtos/transactions-financial-summary-response.dto";

export class GetTransactionsFinancialSummaryUseCase {
    constructor(
        private readonly saleRepository: SaleRepository,
    ) {}

    async execute(transactions: TransactionEntity[]): Promise<TransactionsFinancialSummaryResponseDTO> {
        // 1. Transacciones de Ingreso "reales": accountType === INCOME y nombre de tipo NO excluido
        const incomeTransactions = transactions.filter(t =>
            t.transactionType?.accountType === AccountTypeEnum.INCOME &&
            !EXCLUDED_INCOME_TRANSACTION_TYPE_NAMES.includes((t.transactionType?.name ?? '').toLowerCase())
        );

        // 2. Total de ingresos brutos (sin descontar devoluciones todavía)
        const grossIncomes = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);

        // 3. saleIds distintos de las transacciones de ingreso que sí tienen saleId
        const saleIds = Array.from(new Set(
            incomeTransactions
                .filter(t => t.saleId !== null)
                .map(t => t.saleId as bigint)
        ));

        // 4. Ventas asociadas, con sus saleDetails (incluye `returns` para poder netear)
        const sales = await this.saleRepository.findManyWithDetailsByIds(saleIds);

        // 5. Filtro defensivo: solo ventas completadas (igual que en cash)
        const completedSales = sales.filter(sale => sale.status === SaleStatusEnum.COMPLETED);

        // 6. Detalles de venta de las ventas completadas
        // NOTA: los ingresos manuales (sin saleId) cuentan en totalIncomes pero no aportan
        // aquí a totalInvested, ya que no tienen costo atribuible (misma asimetría que en cash).
        const saleDetails = completedSales.flatMap(sale => sale.saleDetails ?? []);

        // 7. Devoluciones: se descuentan de los ingresos en vez de contarse como un egreso aparte
        // (ver RETURN_TRANSACTION_TYPE_NAMES, excluido de expenseTransactions más abajo) — evita
        // restar el monto devuelto dos veces (aquí y en egresos). La transacción de devolución sigue
        // apareciendo en la lista de movimientos, sólo no se suma a totalExpenses.
        const returnsAmount = saleDetails.reduce(
            (acc, detail) => acc + (detail.returns?.reduce((sum, item) => sum + item.amountReturn, 0) ?? 0),
            0,
        );
        const totalIncomes = grossIncomes - returnsAmount;

        // 8-9. Total invertido: se suma (quantity - quantityReturn) * unitCostAtSale, congelado en
        // cada detalle de venta al momento de vender (mismo criterio que
        // GetCashSessionSalesSummaryUseCase) — las unidades devueltas no cuentan como costo de lo
        // vendido, igual que ya no cuentan como ingreso. Ya no se recalcula un promedio en vivo
        // sobre los lotes actuales — el resumen financiero de transacciones ya cerradas no debe
        // moverse con el tiempo.
        const totalInvested = saleDetails.reduce((acc, detail) => {
            const unitsReturned = detail.returns?.reduce((sum, item) => sum + item.quantityReturn, 0) ?? 0;
            const netQuantity = detail.quantity - unitsReturned;
            return acc + netQuantity * (detail.unitCostAtSale ?? 0);
        }, 0);

        // 10. Ganancia antes de egresos
        const profitBeforeExpenses = totalIncomes - totalInvested;

        // 11. Transacciones de Egreso "reales": accountType === EXPENSE, nombre de tipo NO excluido y
        // que no sea una devolución (su monto ya se descontó de totalIncomes en el paso 7).
        const expenseTransactions = transactions.filter(t => {
            const typeName = (t.transactionType?.name ?? '').toLowerCase();
            return t.transactionType?.accountType === AccountTypeEnum.EXPENSE &&
                !EXCLUDED_EXPENSE_TRANSACTION_TYPE_NAMES.includes(typeName) &&
                !RETURN_TRANSACTION_TYPE_NAMES.includes(typeName);
        });
        const totalExpenses = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);

        // 12. Ganancia después de egresos
        const profitAfterExpenses = profitBeforeExpenses - totalExpenses;

        // 13. Márgenes, con guarda contra división por 0
        const marginBeforeExpensesPercent = totalIncomes > 0 ? (profitBeforeExpenses / totalIncomes) * 100 : 0;
        const marginAfterExpensesPercent = totalIncomes > 0 ? (profitAfterExpenses / totalIncomes) * 100 : 0;

        // 14. Cantidad de ventas completadas consideradas
        const salesCountConsidered = completedSales.length;

        return {
            grossIncomes,
            returnsAmount,
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
