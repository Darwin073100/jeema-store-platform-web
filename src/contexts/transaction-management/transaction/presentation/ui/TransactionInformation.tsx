'use client'
import { numberMoneyFormat } from "@/shared/lib/utils/number-formatter"
import { Badge } from "@/shared/ui/components/badges/Badge"
import clsx from "clsx"
import { FcBearish, FcBullish, FcMoneyTransfer, FcSalesPerformance } from "react-icons/fc"
import React from "react"
import { useTransactionStore } from "../stores/transaction.store"

export const TransactionInformation = () => {
    const { financialSummary } = useTransactionStore();

    const totalIncomes = financialSummary?.totalIncomes ?? 0;
    const totalInvested = financialSummary?.totalInvested ?? 0;
    const profitBeforeExpenses = financialSummary?.profitBeforeExpenses ?? 0;
    const totalExpenses = financialSummary?.totalExpenses ?? 0;
    const profitAfterExpenses = financialSummary?.profitAfterExpenses ?? 0;
    const marginBeforeExpensesPercent = financialSummary?.marginBeforeExpensesPercent ?? 0;
    const marginAfterExpensesPercent = financialSummary?.marginAfterExpensesPercent ?? 0;
    const salesCountConsidered = financialSummary?.salesCountConsidered ?? 0;
    const isProfitAfterExpenses = profitAfterExpenses >= 0;

    return (
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 my-4">
            <div
                className={clsx(`p-4 rounded-2xl bg-white shadow-lg flex justify-between`)}
                title="Suma de los ingresos netos del periodo (excluye Apertura de Caja y Aumento de efectivo en caja)">
                <div className="flex flex-col justify-center items-center">
                    <Badge type="green">Ingresos</Badge>
                    <FcBullish size={30} />
                </div>
                <div className="flex justify-between gap-2 text-green-700 items-center font-bold text-lg">
                    <span>Total:</span>
                    <span>{numberMoneyFormat(totalIncomes)}</span>
                </div>
            </div>
            <div
                className={clsx(`p-4 rounded-2xl bg-white shadow-lg flex justify-between`)}
                title={`Costo estimado (promedio ponderado por lote) de las ${salesCountConsidered} venta(s) completada(s) consideradas`}>
                <div className="flex flex-col justify-center items-center">
                    <Badge type="purple">Invertido</Badge>
                    <FcMoneyTransfer size={30} />
                </div>
                <div className="flex justify-between gap-2 text-purple-700 items-center font-bold text-lg">
                    <span>Total:</span>
                    <span>{numberMoneyFormat(totalInvested)}</span>
                </div>
            </div>
            <div
                className={clsx(`p-4 rounded-2xl bg-white shadow-lg flex justify-between`)}
                title={`Ingresos menos lo invertido, sin descontar egresos (margen ${marginBeforeExpensesPercent.toFixed(1)}%)`}>
                <div className="flex flex-col justify-center items-center">
                    <Badge type="blue">Ganancia antes de egresos</Badge>
                    <FcSalesPerformance size={30} />
                </div>
                <div className="flex justify-between gap-2 text-blue-700 items-center font-bold text-lg">
                    <span>Total:</span>
                    <span>{numberMoneyFormat(profitBeforeExpenses)}</span>
                </div>
            </div>
            <div
                className={clsx(`p-4 rounded-2xl bg-white shadow-lg flex justify-between`)}
                title="Suma de los egresos netos del periodo (excluye Retiro de efectivo/Corte de caja)">
                <div className="flex flex-col justify-center items-center">
                    <Badge type="red">Egresos</Badge>
                    <FcBearish size={30} />
                </div>
                <div className="flex justify-between gap-2 text-red-700 items-center font-bold text-lg">
                    <span>Total:</span>
                    <span>{`- ${numberMoneyFormat(totalExpenses)}`}</span>
                </div>
            </div>
            <div
                className={clsx(`p-4 rounded-2xl bg-white shadow-lg flex justify-between`)}
                title={`Ganancia antes de egresos menos los egresos del periodo: resultado neto final (margen ${marginAfterExpensesPercent.toFixed(1)}%)`}>
                <div className="flex flex-col justify-center items-center">
                    <Badge type={isProfitAfterExpenses ? 'green' : 'red'}>
                        {isProfitAfterExpenses ? 'Ganancia después de egresos' : 'Pérdida después de egresos'}
                    </Badge>
                    {isProfitAfterExpenses ? <FcBullish size={30} /> : <FcBearish size={30} />}
                </div>
                <div className={clsx(`flex justify-between gap-2 items-center font-bold text-2xl`, isProfitAfterExpenses ? 'text-green-700' : 'text-red-700')}>
                    <span>Total:</span>
                    <span>{numberMoneyFormat(profitAfterExpenses)}</span>
                </div>
            </div>
        </section>
    )
}
