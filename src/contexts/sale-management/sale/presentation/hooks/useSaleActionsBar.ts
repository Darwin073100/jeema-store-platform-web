'use client'
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useSaleUIStore } from '../stores/sale.ui.store';
import { useSaleStore } from '../stores/sale.store';
import { findAllSaleByBranchOfficeAndFilterAction } from '../actions/find-all-sale-by-branch-office-and-filter.action';
import { numberBasicFormat } from '@/shared/lib/utils/number-formatter';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { downloadXLSX } from '@/shared/lib/utils/download.excel';
import { useRouter } from 'next/navigation';

const schema = yup.object().shape({
    dateStart: yup.date()
        .transform((value, originalValue) => originalValue === '' ? undefined : value)
        .optional().notRequired().nullable(),
    dateEnd: yup.date()
        .transform((value, originalValue) => originalValue === '' ? undefined : value)
        .optional().notRequired().nullable(),
    search: yup.string()
        .transform((value, originalValue) => originalValue === '' ? undefined : value)
        .optional().notRequired().nullable(),
}).required();
type FormData = yup.InferType<typeof schema>;

const useSaleActionsBar = () => {
    const { initLoading, finishLoading } = useSaleUIStore();
    const { setSales, sales } = useSaleStore();
    const router = useRouter();

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',

    });

    const redirectPage = () => {
        initLoading('view-returns');
        router.push('sale/returns')
    }

    const currentSales = sales.map(item => {
        const base = {
            'FOLIO': item.saleId,
            'CLIENTE': `${item.customer?.firstName} ${item.customer?.lastName}`,
            'EMPLEADO': `${item.employee?.firstName} ${item.employee?.lastName}`,
            'STATUS': item.status,
            'TOTAL': numberBasicFormat(item.totalAmount),
            'FECHA': formatDateShort(item.createdAt),
        } as Record<string, any>;
        return base;
    });
    const handleDownloadExcel = () => {
        downloadXLSX(currentSales, 'Ventas');
    }

    const onSubmit = async (form: FormData) => {
        initLoading('find-sales');
        const salesResponse = await findAllSaleByBranchOfficeAndFilterAction({
            dateStart: form.dateStart ?? undefined,
            dateEnd: form.dateEnd ?? undefined,
            search: form.search ?? undefined
        });
        finishLoading();
        if (salesResponse.ok && salesResponse.value) {
            setSales(salesResponse.value.sales);
        }
    }

    return {
        onSubmit,
        handleSubmit,
        register,
        errors,
        redirectPage,
        handleDownloadExcel,
    }
}

export { useSaleActionsBar };
