'use client'
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { TextInput } from '@/shared/ui/components/inputs';
import React from 'react'
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { CashSessionEntity } from '../../domain/entities/cash-session.entity';
import { FaFilter } from 'react-icons/fa';
import { useCashMovementsOptions } from '../hooks/useCashMovementsOptions';
import { useCashStore } from '../../infraestructure/stores/cash.store';
import { LabelInput } from '@/shared/ui/components/labels';
interface Props {
    cashSessions: CashSessionEntity[]
}
const CashMovementsOptios = ({ cashSessions: data }: Props) => {
    const { loading, errors, handleSubmit, onSubmit, register } = useCashMovementsOptions({data});
    const { cashSessions, dateFinish, dateInit } = useCashStore();

    return (
        <>
            <div className="flex gap-4 items-center justify-between">
                <span></span>
                <div className='flex gap-4 items-center'>
                    <Button disabled={loading} color='green'>
                        <PiMicrosoftExcelLogoFill />
                        Exportar a Excel
                    </Button>
                    <div>
                        Movimientos<Badge>{cashSessions.length}</Badge>
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='flex gap-4'>
                <div>
                    <LabelInput value='Fecha de inicio' description='Si borras la fécha de inicio tomará la del día en transcurso por default.'/>
                    <TextInput
                        {...register('dateInit')}
                        error={!!errors.dateInit?.message}
                        errorMessage={errors.dateInit?.message}
                        name='dateInit'
                        type='date' />
                </div>
                <div>
                    <LabelInput value='Fecha de límite' description='Si borras la fécha límite tomará la del día en transcurso por default.'/>
                    <TextInput
                        {...register('dateFinish')}
                        error={!!errors.dateFinish?.message}
                        errorMessage={errors.dateFinish?.message}
                        name='dateFinish'
                        type='date' />
                </div>
                <div className='flex items-end'>
                    <Button color='yellow'>
                        <FaFilter />
                        Aplicar filtro
                    </Button>
                </div>
            </form>
        </>
    )
}

export { CashMovementsOptios };
