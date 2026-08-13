'use client'
import { useState } from 'react'
import { HiOutlineChartBar } from 'react-icons/hi'
import { TbBoxMultiple, TbCurrencyDollar, TbTrendingDown, TbTrendingUp } from 'react-icons/tb'
import { Button } from '@/shared/ui/components/buttons'
import { Badge } from '@/shared/ui/components/badges/Badge'
import { CardGrid } from '@/shared/ui/components/grids/CardGrid'
import { numberMoneyFormat, numberBasicFormat } from '@/shared/lib/utils/number-formatter'
import { formatDateForInput, formatDateShort } from '@/shared/lib/utils/date-formatter'
import { getProductPerformanceAction } from '../../actions/get-product-performance.action'
import { IProductPerformance } from '../../interfaces/IProductPerformance'

interface Props {
    productId: bigint
    initialPerformance: IProductPerformance | null
}

const ProductPerformance = ({ productId, initialPerformance }: Props) => {
    const [performance, setPerformance] = useState<IProductPerformance | null>(initialPerformance)
    const [dateInit, setDateInit] = useState<string>('')
    const [dateFinish, setDateFinish] = useState<string>('')
    const [loading, setLoading] = useState(false)

    const handleApplyFilter = async () => {
        setLoading(true)
        try {
            const result = await getProductPerformanceAction(
                productId,
                dateInit ? new Date(`${dateInit}T00:00:00`) : undefined,
                dateFinish ? new Date(`${dateFinish}T23:59:59`) : undefined,
            )
            setPerformance(result)
        } finally {
            setLoading(false)
        }
    }

    const handleClearFilter = async () => {
        setDateInit('')
        setDateFinish('')
        setLoading(true)
        try {
            const result = await getProductPerformanceAction(productId)
            setPerformance(result)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="px-6 pt-4 flex justify-between items-center flex-wrap gap-4">
                <div className="flex gap-2 items-center">
                    <HiOutlineChartBar className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold">Rendimiento del producto</h2>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                    <input
                        type="date"
                        value={dateInit}
                        max={formatDateForInput(new Date())}
                        onChange={(e) => setDateInit(e.target.value)}
                        className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                    />
                    <span className="text-sm text-gray-500">a</span>
                    <input
                        type="date"
                        value={dateFinish}
                        max={formatDateForInput(new Date())}
                        onChange={(e) => setDateFinish(e.target.value)}
                        className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                    />
                    <Button size="sm" onClick={handleApplyFilter} disabled={loading || !dateInit || !dateFinish}>
                        Aplicar
                    </Button>
                    <Button size="sm" color="gray" onClick={handleClearFilter} disabled={loading}>
                        Ver histórico completo
                    </Button>
                </div>
            </div>

            {!performance ? (
                <span className="text-gray-700 border border-gray-300 rounded-xl p-4 block mt-4 mx-6">
                    No se pudo calcular el rendimiento de este producto.
                </span>
            ) : (
                <div className="px-6 py-4 space-y-6">
                    <div>
                        <h5 className="font-medium text-gray-700 mb-3">Ventas</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <CardGrid title="Unidades vendidas" icon={<TbBoxMultiple className="w-4 h-4" />}>
                                {numberBasicFormat(performance.sales.unitsSold)}
                            </CardGrid>
                            <CardGrid title="Unidades devueltas" icon={<TbBoxMultiple className="w-4 h-4" />}>
                                {numberBasicFormat(performance.sales.unitsReturned)}
                            </CardGrid>
                            <CardGrid title="Vendido bruto" icon={<TbCurrencyDollar className="w-4 h-4" />}>
                                {numberMoneyFormat(performance.sales.grossRevenue)}
                            </CardGrid>
                            <CardGrid title="Devuelto" icon={<TbCurrencyDollar className="w-4 h-4" />}>
                                {numberMoneyFormat(performance.sales.returnsAmount)}
                            </CardGrid>
                            <CardGrid title="Vendido neto" icon={<TbCurrencyDollar className="w-4 h-4" />}>
                                {numberMoneyFormat(performance.sales.netRevenue)}
                            </CardGrid>
                            <CardGrid title="Última venta">
                                {formatDateShort(performance.sales.lastSaleDate)}
                            </CardGrid>
                        </div>
                    </div>

                    <div>
                        <h5 className="font-medium text-gray-700 mb-3">Compras</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <CardGrid title="Unidades compradas" icon={<TbBoxMultiple className="w-4 h-4" />}>
                                {numberBasicFormat(performance.purchases.unitsPurchased)}
                            </CardGrid>
                            <CardGrid title="Comprado" icon={<TbCurrencyDollar className="w-4 h-4" />}>
                                {numberMoneyFormat(performance.purchases.totalCost)}
                            </CardGrid>
                            <CardGrid title="Costo promedio unitario" icon={<TbCurrencyDollar className="w-4 h-4" />}>
                                {numberMoneyFormat(performance.purchases.avgUnitCost)}
                            </CardGrid>
                            <CardGrid title="Última compra">
                                {formatDateShort(performance.purchases.lastPurchaseDate)}
                            </CardGrid>
                        </div>
                    </div>

                    <div>
                        <h5 className="font-medium text-gray-700 mb-3">Resultado</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <CardGrid
                                title="Ganancia / pérdida estimada"
                                icon={performance.profit.grossProfit >= 0
                                    ? <TbTrendingUp className="w-4 h-4 text-green-600" />
                                    : <TbTrendingDown className="w-4 h-4 text-red-600" />}
                            >
                                <div className="flex items-center gap-2">
                                    <span>{numberMoneyFormat(performance.profit.grossProfit)}</span>
                                    <Badge type={performance.profit.grossProfit >= 0 ? 'green' : 'red'}>
                                        {performance.profit.grossProfit >= 0 ? 'Ganancia' : 'Pérdida'}
                                    </Badge>
                                </div>
                            </CardGrid>
                            <CardGrid title="Margen sobre venta neta">
                                {performance.profit.marginPercent.toFixed(1)}%
                            </CardGrid>
                            <CardGrid title="Stock actual" icon={<TbBoxMultiple className="w-4 h-4" />}>
                                {numberBasicFormat(performance.inventory.currentStockTotal)}
                            </CardGrid>
                            <CardGrid title="Stock a precio de venta" icon={<TbCurrencyDollar className="w-4 h-4" />}>
                                {numberMoneyFormat(performance.inventory.currentStockSaleValue)}
                            </CardGrid>
                            <CardGrid title="Stock a costo" icon={<TbCurrencyDollar className="w-4 h-4" />}>
                                {numberMoneyFormat(performance.inventory.currentStockCostValue)}
                            </CardGrid>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            La ganancia y el costo de stock son estimados, calculados con el costo promedio
                            ponderado de las compras registradas del producto (no hay costeo exacto por lote).
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProductPerformance
