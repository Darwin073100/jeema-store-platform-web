'use client'
import React from 'react'
import clsx from 'clsx';
import { PCol, PrimaryTable, PRow, PTableEmpty } from "@/shared/ui/components/tables/PrimaryTable";
import { FcSalesPerformance, FcScatterPlot } from "react-icons/fc";
import { numberBasicFormat, numberMoneyFormat } from "@/shared/lib/utils/number-formatter";
import { Badge } from "@/shared/ui/components/badges/Badge";
import { SelectMenu, SelectMenuOption, TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { PeriodMode, TOP_LIMIT_OPTIONS, useTopProductsSection } from '../hooks/useTopProductsSection';
import { ProductsTopByBranchOfficeResponseDto, TopProductsResponseDto } from '../../application/dtos/products-top-by-branch-office-response.dto';

interface Props {
    initialData: TopProductsResponseDto;
    categories: SelectMenuOption[];
}

const limitOptions: SelectMenuOption[] = TOP_LIMIT_OPTIONS.map(value => ({ value: String(value), text: `Top ${value}` }));

const periodModes: { value: PeriodMode, text: string }[] = [
    { value: 'month', text: 'Mes' },
    { value: 'range', text: 'Rango' },
];

/** `YYYY-MM-DD` → "1 nov 2026" (en hora local, sin desfase de zona horaria). */
const formatDay = (value: string) => {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
};

interface RankingTableProps {
    items: ProductsTopByBranchOfficeResponseDto[];
    highlight: 'quantity' | 'total';
    showCategory: boolean;
}

const RankingTable = ({ items, highlight, showCategory }: RankingTableProps) => (
    <div className="max-h-[40rem] overflow-y-auto rounded-xl">
        <PrimaryTable theadList={['Top', 'Producto', 'Total', 'Uds']} isActions={false}>
            {items.length === 0 && <PTableEmpty colsNumber={4} />}
            {items.map((item, i) => (
                <PRow key={item.productId.toString()}>
                    <PCol>{i + 1}</PCol>
                    <PCol>
                        {item.name}
                        {showCategory && item.categoryName && (
                            <span className="block text-xs font-normal text-gray-500">{item.categoryName}</span>
                        )}
                    </PCol>
                    <PCol>
                        {highlight === 'total'
                            ? <Badge type="green">{numberMoneyFormat(item.totalSales)}</Badge>
                            : numberMoneyFormat(item.totalSales)}
                    </PCol>
                    <PCol>
                        {highlight === 'quantity'
                            ? <Badge type="green">{numberBasicFormat(item.quantitySales)}</Badge>
                            : numberBasicFormat(item.quantitySales)}
                    </PCol>
                </PRow>
            ))}
        </PrimaryTable>
    </div>
);

const TopProductsSection = ({ initialData, categories }: Props) => {
    const { data, filters, loading, errorMessage, updateFilters, changeMode } = useTopProductsSection({ initialData });
    const showCategory = filters.categoryId === '';

    return (
        <section className="w-full pt-8" aria-busy={loading}>
            <div className="flex flex-wrap items-end gap-4 mb-2">
                <div>
                    <span className="block font-medium text-gray-700 mb-1">Periodo</span>
                    <div role="group" aria-label="Tipo de periodo" className="inline-flex rounded-xl border border-gray-300 bg-white p-1 shadow-sm">
                        {periodModes.map(mode => (
                            <button
                                key={mode.value}
                                type="button"
                                aria-pressed={filters.mode === mode.value}
                                onClick={() => changeMode(mode.value)}
                                className={clsx(
                                    'rounded-lg px-4 py-1.5 text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                                    filters.mode === mode.value ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                                )}>
                                {mode.text}
                            </button>
                        ))}
                    </div>
                </div>

                {filters.mode === 'month' ? (
                    <div>
                        <LabelInput value='Mes' htmlFor='topMonth' />
                        <TextInput
                            id='topMonth'
                            type='month'
                            value={filters.month}
                            onChange={(e) => updateFilters({ month: e.target.value })} />
                    </div>
                ) : (
                    <>
                        <div>
                            <LabelInput value='Desde' htmlFor='topDateInit' />
                            <TextInput
                                id='topDateInit'
                                type='date'
                                value={filters.dateInit}
                                max={filters.dateFinish || undefined}
                                onChange={(e) => updateFilters({ dateInit: e.target.value })} />
                        </div>
                        <div>
                            <LabelInput value='Hasta' htmlFor='topDateFinish' />
                            <TextInput
                                id='topDateFinish'
                                type='date'
                                value={filters.dateFinish}
                                min={filters.dateInit || undefined}
                                onChange={(e) => updateFilters({ dateFinish: e.target.value })} />
                        </div>
                    </>
                )}

                <div className="min-w-56">
                    <LabelInput value='Categoría' htmlFor='topCategory' />
                    <SelectMenu
                        id='topCategory'
                        items={categories}
                        placeholder='Todas las categorías'
                        value={filters.categoryId}
                        onChange={(e) => updateFilters({ categoryId: e.target.value })} />
                </div>

                <div>
                    <LabelInput value='Mostrar' htmlFor='topLimit' />
                    <SelectMenu
                        id='topLimit'
                        items={limitOptions}
                        placeholder={null}
                        value={String(filters.limit)}
                        onChange={(e) => updateFilters({ limit: Number(e.target.value) })} />
                </div>

                {loading && <Spinner size={20} />}
            </div>

            <p className="text-sm text-gray-500 mb-6" aria-live="polite">
                {errorMessage
                    ? <span className="text-red-600">{errorMessage}</span>
                    : <>Del {formatDay(data.dateInit)} al {formatDay(data.dateFinish)}</>}
            </p>

            <div className={clsx("w-full grid grid-cols-2 max-md:grid-cols-1 gap-4 transition-opacity", loading && 'opacity-60')}>
                <div>
                    <h2 className="flex items-center justify-center gap-4 mb-4 uppercase text-2xl">
                        <FcScatterPlot />
                        Más vendido por volumen
                    </h2>
                    <RankingTable items={data.byQuantity} highlight='quantity' showCategory={showCategory} />
                </div>
                <div>
                    <h2 className="flex items-center justify-center gap-4 mb-4 uppercase text-2xl">
                        <FcSalesPerformance />
                        Más vendido por monto
                    </h2>
                    <RankingTable items={data.byTotal} highlight='total' showCategory={showCategory} />
                </div>
            </div>
        </section>
    )
}

export { TopProductsSection };
