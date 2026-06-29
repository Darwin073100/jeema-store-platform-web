'use client'
import React from 'react'
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { ButtonOutLine } from '@/shared/ui/components/buttons/ButtonOutLine';
import { LiaCashRegisterSolid } from 'react-icons/lia';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { useCashUIStore } from '../stores/cash-ui.store';
import { FloatMessage } from '@/shared/ui/components/messages';
import { GrTransaction } from "react-icons/gr";
import { useRouter } from 'next/navigation';
import { HideElement } from '@/contexts/authentication-management/auth/presentation/ui/HideElement';
import { RegisterCashRegisterModal } from './RegisterCashRegisterModal';
import { ICashRegister } from '@/contexts/cash-management/cash-register/presentation/interfaces/ICashRegister';
interface Props {
    cashes: ICashRegister[]
}
const CashOptios = ({ cashes }: Props) => {
    const { openCashModal, floatMessageState  } = useCashUIStore();
    const router = useRouter();

    return (
        <>
            <div className="flex gap-4 items-center justify-between">
                <div className='flex gap-4 items-center'>
                    <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                        <ButtonOutLine onClick={()=> openCashModal('registerCashRegister')}>
                            <LiaCashRegisterSolid />
                            Agregar nueva caja
                        </ButtonOutLine>
                        <ButtonOutLine color='green' onClick={()=> router.push('cash/session')}>
                            <GrTransaction />
                            Ver movimientos
                        </ButtonOutLine>
                    </HideElement>
                </div>
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
