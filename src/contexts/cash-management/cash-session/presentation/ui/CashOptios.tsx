'use client'
import React from 'react'
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { ButtonOutLine } from '@/shared/ui/components/buttons/ButtonOutLine';
import { LiaCashRegisterSolid } from 'react-icons/lia';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { CashRegisterEntity } from '../../../../../features/cash/domain/entities/cash-register.entity';
import { useCashUIStore } from '../stores/cash-ui.store';
import { RegisterCashRegisterModal } from '../../../../../features/cash/presentation/ui/RegisterCashRegisterModal';
import { FloatMessage } from '@/shared/ui/components/messages';
import { GrTransaction } from "react-icons/gr";
import { useRouter } from 'next/navigation';
import { HideElement } from '@/features/auth/ui/HideElement';
interface Props {
    cashes: CashRegisterEntity[]
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
