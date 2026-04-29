'use client';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import React, { useEffect, useState } from 'react'
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import { IoReturnDownBack } from 'react-icons/io5';
import { HideElement } from '@/contexts/authentication-management/auth/presentation/ui/HideElement';
import { ISale } from '../interfaces/ISale';
import { LabelInput } from '@/shared/ui/components/labels';
import { TextInput } from '@/shared/ui/components/inputs';
import { FaFilter } from 'react-icons/fa';
import { useSaleStore } from '../stores/sale.store';
import { useSaleActionsBar } from '../hooks/useSaleActionsBar';
import { useSaleUIStore } from '../stores/sale.ui.store';
interface Props {
    data: ISale[]
}
const SaleActionsBar = ({ data }: Props) => {
    const { setSales, sales } = useSaleStore();
    const { loading } = useSaleUIStore();
    const { errors, handleSubmit, onSubmit, register, redirectPage, handleDownloadExcel } = useSaleActionsBar();

    useEffect(() => {
        setSales(data);
    }, [data]);

    return (
        <div>
            <div className="">
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center gap-2'>
                    <div className='w-full'>
                        <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
                            <div className='w-full flex justify-between gap-4'>
                                <div className='flex items-center gap-4'>
                                    <div>
                                        <TextInput
                                            {...register('dateStart')}
                                            error={!!errors.dateStart?.message}
                                            errorMessage={errors.dateStart?.message}
                                            name='dateStart'
                                            type='date' />
                                    </div>
                                    <div>
                                        <TextInput
                                            {...register('dateEnd')}
                                            error={!!errors.dateEnd?.message}
                                            errorMessage={errors.dateEnd?.message}
                                            name='dateFinish'
                                            type='date' />
                                    </div>
                                    <div className='flex items-center'>
                                        <Button color='yellow' disabled={loading === 'find-sales'}>
                                            {loading === 'find-sales' ? <Spinner size={14} /> : <FaFilter size={14} />}
                                            <span className='max-lg:hidden'>Filtrar</span>
                                        </Button>
                                    </div>
                                </div>
                                <div className='flex gap-4 items-center'>
                                    <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
                                        <Button disabled={loading === 'exportExcel'} color='green' onClick={() => handleDownloadExcel()}>
                                            {loading === 'exportExcel' ? <Spinner /> : <PiMicrosoftExcelLogoFill size={14} />}
                                            <span className='max-md:hidden'>Exportar a Excel</span>
                                        </Button>
                                    </HideElement>
                                    <div>
                                        Ventas<Badge>{sales.length}</Badge>
                                    </div>
                                </div>
                            </div>
                        </HideElement>
                    </div>
                    <div className='w-full'>
                        <TextInput
                            {...register('search')}
                            error={!!errors.search?.message}
                            errorMessage={errors.search?.message}
                            name='search'
                            placeholder="Filtrar por cliente o empleado, separados por nombres o apellidos." />
                    </div>
                </form>
            </div>
            <div className='py-4'>
                <Button color="yellow" size="sm" onClick={() => redirectPage()}>
                    {loading === 'view-returns' ? <Spinner /> : <IoReturnDownBack size={14} />}
                    <span className='max-sm:hidden'>Ver devoluciones</span>
                </Button>
            </div>
        </div>
    )
}

export { SaleActionsBar };
