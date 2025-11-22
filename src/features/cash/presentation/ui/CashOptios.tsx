'use client'
import { Badge } from '@/ui/components/badges/Badge';
import { Button } from '@/ui/components/buttons';
import { ButtonOutLine } from '@/ui/components/buttons/ButtonOutLine';
import { TextInput } from '@/ui/components/inputs';
import React from 'react'
import { LiaCashRegisterSolid } from 'react-icons/lia';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { CashRegisterEntity } from '../../domain/entities/cash-register.entity';
import { useCashUIStore } from '../../infraestructure/stores/cash-ui.store';
import { RegisterCashRegisterModal } from './RegisterCashRegisterModal';
import { FloatMessage } from '@/ui/components/messages';
interface Props {
    cashes: CashRegisterEntity[]
}
const CashOptios = ({ cashes }: Props) => {
    const { openCashModal, floatMessageState  } = useCashUIStore();
    return (
        <>
            <div className="flex gap-4 items-center justify-between">
                <ButtonOutLine onClick={()=> openCashModal('registerCashRegister')}>
                    <LiaCashRegisterSolid />
                    Agregar nueva caja
                </ButtonOutLine>
                <div className='flex gap-4 items-center'>
                    <Button color='green'>
                        <PiMicrosoftExcelLogoFill />
                        Exportar a Excel
                    </Button>
                    <div>
                        Cajas <Badge>{cashes.length}</Badge>
                    </div>
                </div>
            </div>
            <RegisterCashRegisterModal />
            <FloatMessage
                {...floatMessageState} />
        </>
    )
}

export { CashOptios };
