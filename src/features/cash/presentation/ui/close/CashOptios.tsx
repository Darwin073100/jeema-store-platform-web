'use client'
import { Badge } from '@/ui/components/badges/Badge';
import { Button } from '@/ui/components/buttons';
import { ButtonOutLine } from '@/ui/components/buttons/ButtonOutLine';
import React from 'react'
import { LiaCashRegisterSolid } from 'react-icons/lia';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { FloatMessage } from '@/ui/components/messages';
import { CashSessionEntity } from '@/features/cash/domain/entities/cash-session.entity';
import { useCashUIStore } from '@/features/cash/infraestructure/stores/cash-ui.store';
interface Props {
    cashSession: CashSessionEntity
}
const CashCloseOptios = ({ cashSession }: Props) => {
    const { openCashModal, floatMessageState  } = useCashUIStore();
    return (
        <>
            <div className="flex gap-4 items-center justify-between">
                <Button onClick={()=> openCashModal('registerCashRegister')}>
                    <LiaCashRegisterSolid />
                    Hacer el corte
                </Button>
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
            <FloatMessage
                {...floatMessageState} />
        </>
    )
}

export { CashCloseOptios };
