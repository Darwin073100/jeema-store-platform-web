'use client'
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { TextInput } from '@/shared/ui/components/inputs';
import React, { useEffect } from 'react'
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { FaFilter } from 'react-icons/fa';
import { useTransactionMovementsOptios } from '../hooks/useTransactionMovementsOptios';
import { useTransactionStore } from '../stores/transaction.store';
import { useTransactionUIStore } from '../stores/transaction-ui.store';
import { FloatMessage } from '@/shared/ui/components/messages';
import { LabelInput } from '@/shared/ui/components/labels';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { ITransaction } from '../interfaces/ITransaction';
import { ButtonOutLine } from '@/shared/ui/components/buttons/ButtonOutLine';

interface Props {
    transactions: ITransaction[]
}

const TransactionMovementsOptios = ({ transactions }: Props) => {
    const { handleExport, errors, handleSubmit, onSubmit, register } = useTransactionMovementsOptios();
    const { setTransactions, transactionsFiltered } = useTransactionStore();
    const { loading, floatMessageState } = useTransactionUIStore();

    useEffect(() => {
        setTransactions(transactions);
    }, [transactions]);

    return (
        <>
            <div className="flex gap-4 items-center justify-between mb-2">
                <form onSubmit={handleSubmit(onSubmit)} className='flex gap-4'>
                    <div>
                        <LabelInput value='Fecha de inicio' description='Si borras la fécha de inicio tomará la del día en transcurso por default.' />
                        <TextInput
                            {...register('dateInit')}
                            error={!!errors.dateInit?.message}
                            errorMessage={errors.dateInit?.message}
                            name='dateInit'
                            type='date' />
                    </div>
                    <div>
                        <LabelInput value='Fecha de límite' description='Si borras la fécha límite tomará la del día en transcurso por default.' />
                        <TextInput
                            {...register('dateFinish')}
                            error={!!errors.dateFinish?.message}
                            errorMessage={errors.dateFinish?.message}
                            name='dateFinish'
                            type='date' />
                    </div>
                    <div className='flex items-end'>
                        <Button disabled={loading === 'filterTransaction'}>
                            {loading === 'filterTransaction' ? <Spinner size={14} /> : <FaFilter size={14} />}
                            Aplicar filtro
                        </Button>
                    </div>
                </form>
                <div className='flex gap-4 items-center'>
                    <ButtonOutLine color='green' onClick={() => handleExport()}>
                        <PiMicrosoftExcelLogoFill />
                        Exportar a Excel
                    </ButtonOutLine>
                    <div>
                        Movimientos<Badge>{transactionsFiltered.length}</Badge>
                    </div>
                </div>
                <FloatMessage
                    {...floatMessageState} />
            </div>
            <div className='flex gap-4'>
            </div>
        </>
    )
}

export { TransactionMovementsOptios };
