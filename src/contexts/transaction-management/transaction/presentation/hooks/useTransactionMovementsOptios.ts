'use client'
import * as yup from 'yup';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { downloadXLSX } from '@/shared/lib/utils/download.excel';
import { useTransactionStore } from '../stores/transaction.store';
import { useTransactionUIStore } from '../stores/transaction-ui.store';
import { findAllManyFilterTransactionsAction } from '../actions/find-cash-movements-by-branch-office-id.action';

const schema = yup.object().shape({
    dateInit: yup.date()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .optional().notRequired().nullable(),
    dateFinish: yup.date()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .optional().notRequired().nullable(),
}).required();

type FormData = yup.InferType<typeof schema>;

const useTransactionMovementsOptios = () => {
    const { transactions, setTransactions, setTransactionsFiltered } = useTransactionStore();
    const { initLoading, finishLoading } = useTransactionUIStore();
    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    useEffect(()=>{
        setTransactionsFiltered(transactions);
    }, [transactions]);

    const dataExcel = transactions.map(item => ({
        FOLIO: item.transactionId,
        MONTO: Number(item.amount.toFixed(2)),
        TIPO: item.transactionType?.accountType ?? '',
        DESCRIPCION: item.transactionType?.name ?? '',
        NOTA: item.description ?? '',
        EMPLEADO: `${item.employee?.firstName ?? ''} ${item.employee?.lastName ?? ''}`,
        SUCURSAL: item.branchOffice?.name ?? '',
        CAJA: '',
        FECHA: formatDateShort(item.updatedAt ?? item.createdAt)
    }));
    const handleExport = () => {
        // Llama a la función de descarga con tu array y el nombre deseado
        downloadXLSX(dataExcel, 'Movimientos Financieros');
    };
    const onSubmit = async (info: FormData) => {
        initLoading('filterTransaction');
        const lotsResponse = await findAllManyFilterTransactionsAction({dateInit:info.dateInit ?? null, dateEnd: info.dateFinish ?? null, cashSessionId: null, employeeId: null,saleId: null, transactionType: null});
        finishLoading();
        if(lotsResponse.ok && lotsResponse.value){
            setTransactionsFiltered(lotsResponse.value.transactions);
            setTransactions(lotsResponse.value.transactions);
        }
    }
    return {
        handleExport,
        onSubmit,
        handleSubmit,
        register,
        errors,
    }
}

export { useTransactionMovementsOptios };