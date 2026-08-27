'use client'
import React from 'react'
import { PCol, PrimaryTable, PRow } from "@/shared/ui/components/tables/PrimaryTable";
import { FcSalesPerformance, FcScatterPlot } from "react-icons/fc";
import { numberBasicFormat, numberMoneyFormat } from "@/shared/lib/utils/number-formatter";
import { Badge } from "@/shared/ui/components/badges/Badge";
import { TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { Button } from '@/shared/ui/components/buttons';
import { FaFilter } from 'react-icons/fa';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { useTopProductsSection } from '../hooks/useTopProductsSection';
import { ProductsTopByBranchOfficeResponseDto } from '../../application/dtos/products-top-by-branch-office-response.dto';

interface Props {
    initialTopQuantity: ProductsTopByBranchOfficeResponseDto[];
    initialTopTotal: ProductsTopByBranchOfficeResponseDto[];
}

const TopProductsSection = ({ initialTopQuantity, initialTopTotal }: Props) => {
    const { productsTopQuantity, productsTopTotal, loading, register, errors, handleSubmit, onSubmit } = useTopProductsSection({
        initialTopQuantity,
        initialTopTotal,
    });

    return (
        <div className="w-full pt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="flex max-md:flex-col gap-4 items-end mb-6">
                <div>
                    <LabelInput value='Fecha de inicio' description='Si borras la fecha de inicio tomará el primer día del mes actual por default.' />
                    <TextInput
                        {...register('dateInit')}
                        error={!!errors.dateInit?.message}
                        errorMessage={errors.dateInit?.message}
                        name='dateInit'
                        type='date' />
                </div>
                <div>
                    <LabelInput value='Fecha de límite' description='Si borras la fecha límite tomará el último día del mes actual por default.' />
                    <TextInput
                        {...register('dateFinish')}
                        error={!!errors.dateFinish?.message}
                        errorMessage={errors.dateFinish?.message}
                        name='dateFinish'
                        type='date' />
                </div>
                <div>
                    <Button type='submit' disabled={loading}>
                        {loading ? <Spinner size={15} /> : <FaFilter />}
                        Aplicar filtro
                    </Button>
                </div>
            </form>
            <div className="w-full grid grid-cols-2 max-md:grid-cols-1 gap-4">
                <div>
                    <h2 className="flex items-center justify-center gap-4 mb-4 uppercase text-2xl">
                        <FcScatterPlot />
                        Más vendido por volumen
                    </h2>
                    <PrimaryTable key='topQuantity' theadList={['Top', 'Producto', 'Total', 'Uds']} isActions={false}>
                        {productsTopQuantity.map((item, i) => (
                            <PRow key={item.productId}>
                                <PCol>{i + 1}</PCol>
                                <PCol>{item.name}</PCol>
                                <PCol>{numberMoneyFormat(item.totalSales)}</PCol>
                                <PCol><Badge type="green">{numberBasicFormat(item.quantitySales)}</Badge></PCol>
                            </PRow>
                        ))}
                    </PrimaryTable>
                </div>
                <div>
                    <h2 className="flex items-center justify-center gap-4 mb-4 uppercase text-2xl">
                        <FcSalesPerformance />
                        Más vendido por monto
                    </h2>
                    <PrimaryTable key='topTotal' theadList={['Top', 'Producto', 'Total', 'Uds']} isActions={false}>
                        {productsTopTotal.map((item, i) => (
                            <PRow key={item.productId}>
                                <PCol>{i + 1}</PCol>
                                <PCol>{item.name}</PCol>
                                <PCol><Badge type="green">{numberMoneyFormat(item.totalSales)}</Badge></PCol>
                                <PCol>{numberBasicFormat(item.quantitySales)}</PCol>
                            </PRow>
                        ))}
                    </PrimaryTable>
                </div>
            </div>
        </div>
    )
}

export { TopProductsSection };
