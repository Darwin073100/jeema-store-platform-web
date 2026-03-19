import React from 'react'
import { Button } from '@/shared/ui/components/buttons'
import { HiPlus } from 'react-icons/hi'
import { useRegisterLotModal } from '../hooks/useRegisterLotModal'
import { RegisterLotModal } from './RegisterLotModal'

interface Props {
    productId?: string;
    className?: string;
}

const RegisterLotButton = ({ productId, className }: Props) => {
    const { handleOpenRegisterLotModal } = useRegisterLotModal();

    return (
        <>
            <Button
                onClick={() => handleOpenRegisterLotModal(productId)}
                className={`flex items-center ${className}`}
            >
                <HiPlus className="mr-2" />
                Agregar Lote
            </Button>
            <RegisterLotModal />
        </>
    )
}

export { RegisterLotButton };
