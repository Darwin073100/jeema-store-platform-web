import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { Badge } from '@/shared/ui/components/badges/Badge';
import clsx from 'clsx';
import React from 'react'
import { FcSalesPerformance, FcMoneyTransfer, FcBearish, FcBullish } from 'react-icons/fc';
import { ICashSessionSalesSummary } from '../../interfaces/ICashSessionSalesSummary';

interface Props {
    summary: ICashSessionSalesSummary | null;
}

const CashSalesSummary = ({ summary }: Props) => {
    const totalSales = summary?.totalSales ?? 0;
    const totalInvested = summary?.totalInvested ?? 0;
    const profit = summary?.profit ?? 0;
    const isProfit = profit >= 0;

    return (
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
            <div className={clsx(`p-4 rounded-2xl bg-white shadow-lg flex flex-col gap-3`)} title="Suma de las ventas completadas registradas en esta caja">
                <Badge type="blue">Ventas del día</Badge>
                <div className="flex justify-between items-center gap-2">
                    <FcSalesPerformance size={30} />
                    <div className="flex justify-between gap-2 text-blue-700 items-center font-bold text-lg">
                        <span>Total:</span>
                        <span>{numberMoneyFormat(totalSales)}</span>
                    </div>
                </div>
            </div>
            <div className={clsx(`p-4 rounded-2xl bg-white shadow-lg flex flex-col gap-3`)} title="Costo estimado (promedio ponderado de compra) de los productos vendidos en esta caja">
                <Badge type="purple">Monto Invertido</Badge>
                <div className="flex justify-between items-center gap-2">
                    <FcMoneyTransfer size={30} />
                    <div className="flex justify-between gap-2 text-purple-700 items-center font-bold text-lg">
                        <span>Total:</span>
                        <span>{numberMoneyFormat(totalInvested)}</span>
                    </div>
                </div>
            </div>
            <div className={clsx(`p-4 rounded-2xl bg-white shadow-lg flex flex-col gap-3`)} title="Ventas del día menos el monto invertido (estimado)">
                <Badge type={isProfit ? 'green' : 'red'}>{isProfit ? 'Ganancia' : 'Pérdida'}</Badge>
                <div className="flex justify-between items-center gap-2">
                    {isProfit ? <FcBullish size={30} /> : <FcBearish size={30} />}
                    <div className={clsx(`flex justify-between gap-2 items-center font-bold text-2xl`, isProfit ? 'text-green-700' : 'text-red-700')}>
                        <span>Total:</span>
                        <span>{numberMoneyFormat(profit)}</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export { CashSalesSummary };
