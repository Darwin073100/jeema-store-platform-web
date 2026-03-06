'use client'
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { ButtonOutLine } from '@/shared/ui/components/buttons/ButtonOutLine';
import React from 'react'
import { LiaCashRegisterSolid } from 'react-icons/lia';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { FloatMessage } from '@/shared/ui/components/messages';
import { CashSessionEntity } from '@/features/cash/domain/entities/cash-session.entity';
import { useCashUIStore } from '@/features/cash/infraestructure/stores/cash-ui.store';
import { CashSessionCloseModal } from './CashSessionCloseModal';
import { useCashStore } from '@/features/cash/infraestructure/stores/cash.store';
import clsx from 'clsx';
import { formatDateWithOutTime } from '@/shared/lib/utils/date-formatter';
import { IoCashSharp } from 'react-icons/io5';
import { TransactionTypeEntity } from '@/features/transaction/domain/entities/transaction-type.entity';
import { CashTransactionModal } from '../CashTransactionModal';
interface Props {
    cashSession: CashSessionEntity,
    incomes: TransactionTypeEntity[],
    expenses: TransactionTypeEntity[],
}
const CashCloseOptios = ({ cashSession, incomes, expenses }: Props) => {
    const { openCashModal, floatMessageState  } = useCashUIStore();
    const { cashSessionSelected } = useCashStore();

    return (
        <>
            <div className="flex gap-4 items-center justify-between">
                <div className='flex gap-4 items-center'>
                    <Button onClick={()=> openCashModal('closeCashSession')} 
                        disabled={!!cashSessionSelected?.isClosed} 
                        className={clsx(`${!!cashSessionSelected?.isClosed?'bg-white text-gray-800 hover:bg-white': ''}`)}>
                        <LiaCashRegisterSolid />
                        <span className="max-sm:hidden">Hacer el corte</span>
                    </Button>
                    {!cashSessionSelected?.isClosed &&
                        <Button color="green" className="shadow-sm hover:shadow-md transition-all" onClick={()=> openCashModal('cashTransaction')}>
                            <IoCashSharp className="text-lg" />
                            <span className="max-sm:hidden">Realizar movimiento</span>
                        </Button>
                    } 
                    {!!cashSessionSelected?.isClosed && <div className=' flex gap-2 items-center'>
                        <span>Corte realizado: </span>
                        <Badge>{formatDateWithOutTime(cashSessionSelected.endTime)}</Badge>
                    </div>} 
                </div>
                <div className='flex gap-4 items-center'>
                    <Button color='green'>
                        <PiMicrosoftExcelLogoFill />
                        <span className='max-sm:hidden'>Exportar a excel</span>
                    </Button>
                    <div>
                        Movimientos <Badge>{cashSession.transactions.length}</Badge>
                    </div>
                </div>
            </div>
            <CashTransactionModal
                expenses={expenses}
                incomes={incomes}/>
            <CashSessionCloseModal/>
            <FloatMessage
                {...floatMessageState} />
        </>
    )
}

export { CashCloseOptios };
