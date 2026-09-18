'use client'
import { numberMoneyFormat } from "@/shared/lib/utils/number-formatter"
import { FcBearish, FcBullish, FcMoneyTransfer, FcSalesPerformance } from "react-icons/fc" 
import { useTransactionInformation } from "../hooks/useTransactionInformation"
import { ReportCard, ReportCardGrid } from "@/shared/ui/components/cards/ReportCard"

export const TransactionInformation = () => {
    const { 
        isProfitAfterExpenses, 
        marginAfterExpensesPercent, 
        marginBeforeExpensesPercent, 
        profitAfterExpenses, 
        profitBeforeExpenses, 
        returnsAmount,
        salesCountConsidered,
        totalExpenses,
        totalIncomes,
        totalInvested
    } = useTransactionInformation();

    return (
        <ReportCardGrid>
            <ReportCard
                type="green"
                tooltip="Suma de los ingresos netos del periodo (excluye Apertura de Caja, Aumento de efectivo en caja, y ya descuenta las devoluciones a clientes)"
                title="Ingresos"
                description={`Total: ${numberMoneyFormat(totalIncomes)}`}
                Icon={FcBullish}
                isAdd
                addText={`${numberMoneyFormat(totalIncomes + returnsAmount)} - ${numberMoneyFormat(returnsAmount)} devuelto`}/>
            <ReportCard
                type="yellow"
                tooltip={`Costo estimado (promedio ponderado por lote) de las ${salesCountConsidered} venta(s) completada(s) consideradas`}
                title="Invertido"
                description={`Total: ${numberMoneyFormat(totalInvested)}`}
                Icon={FcMoneyTransfer} />
            <ReportCard
                tooltip={`Ingresos menos lo invertido, sin descontar egresos (margen ${marginBeforeExpensesPercent.toFixed(1)}%)`}
                title="Ganancia antes de egresos"
                description={`Total: ${numberMoneyFormat(profitBeforeExpenses)}`}
                Icon={FcSalesPerformance} />
            <ReportCard
                type="red"
                tooltip={`Suma de los egresos netos del periodo (excluye Retiro de efectivo/Corte de caja)`}
                title="Egresos"
                description={`Total: -${numberMoneyFormat(totalExpenses)}`}
                Icon={FcBearish} />
            <ReportCard
                type={isProfitAfterExpenses ? 'green' : 'red'}
                tooltip={`Ganancia antes de egresos menos los egresos del periodo: resultado neto final (margen ${marginAfterExpensesPercent.toFixed(1)}%)`}
                title={`${isProfitAfterExpenses ? 'Ganancia después de egresos' : 'Pérdida después de egresos'}`}
                description={`Total: ${numberMoneyFormat(profitAfterExpenses)}`}
                Icon={isProfitAfterExpenses ? FcBullish : FcBearish } />
        </ReportCardGrid>
    )
}