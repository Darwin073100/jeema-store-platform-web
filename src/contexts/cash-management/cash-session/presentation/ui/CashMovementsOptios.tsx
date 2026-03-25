'use client'
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { TextInput } from '@/shared/ui/components/inputs';
import React from 'react'
import { PiMicrosoftExcelLogoFill, PiPrinter } from "react-icons/pi";
import { CashSessionEntity } from '../../../../../features/cash/domain/entities/cash-session.entity';
import { FaFilter } from 'react-icons/fa';
import { useCashMovementsOptions } from '../hooks/useCashMovementsOptions';
import { useCashStore } from '../stores/cash.store';
import { LabelInput } from '@/shared/ui/components/labels';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { useWorkspace } from '@/shared/presentation/hooks/auth/useAuth';
import { CashClosedTicketListModal } from './close/CashClosedTicketListModal';
import { useCashUIStore } from '../stores/cash-ui.store';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
interface Props {
    cashSessions: CashSessionEntity[]
}
const CashMovementsOptios = ({ cashSessions: data }: Props) => {
    const { errors, handleSubmit, onSubmit, register, cashSessionTotalAmount } = useCashMovementsOptions({data});
    const { cashSessions, dateFinish, dateInit } = useCashStore();
    const { openCashModal, loading } = useCashUIStore();

    return (
        <>
            <div className="flex gap-4 items-center justify-between">
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
                        <Button color='yellow' disabled={loading==='movementsCashSession'}>
                            {loading ==='movementsCashSession'? <Spinner size={15} />: <FaFilter />}
                            Aplicar filtro
                        </Button>
                    </div>
                </form>
                <div className='flex gap-4 items-center'>
                    <Button color='green'>
                        <PiMicrosoftExcelLogoFill />
                        Exportar a Excel
                    </Button>
                    <div>
                        Movimientos<Badge>{cashSessions.length}</Badge>
                    </div>
                </div>
            </div>
            <div className='w-full flex justify-between my-2'>
                <span>
                    <Button color='blue' onClick={()=> openCashModal('cashClosedTicketList')}>
                        <PiPrinter />
                        Imprimir cortes
                    </Button>
                </span>
                <div className='flex items-center gap-2'>
                    <span>Total: </span>
                    <span className='text-blue-700 font-bold text-xl'>{numberMoneyFormat(cashSessionTotalAmount())}</span>
                </div>
            </div>
            <CashClosedTicketListModal />
        </>
    )
}

export { CashMovementsOptios };
