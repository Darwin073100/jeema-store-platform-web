export const EXCLUDED_INCOME_TRANSACTION_TYPE_NAMES = ['apertura de caja', 'aumento de efectivo en caja'];
export const EXCLUDED_EXPENSE_TRANSACTION_TYPE_NAMES = ['retiro de efectivo/corte de caja'];

// Tipos de Egreso cuyo monto ya se descuenta directamente de los ingresos en
// GetTransactionsFinancialSummaryUseCase (netea contra `returns.amountReturn`) y por eso NO deben
// sumarse también en totalExpenses — se contaría dos veces. A diferencia de
// EXCLUDED_EXPENSE_TRANSACTION_TYPE_NAMES, estos SÍ deben seguir apareciendo en la lista/tabla/Excel
// de "Movimientos Financieros": el usuario quiere verlos reflejados, sólo que no se traten como un
// egreso más en los totales (la UI los distingue con un badge de otro color, no rojo).
export const RETURN_TRANSACTION_TYPE_NAMES = ['devolución por venta al cliente'];
