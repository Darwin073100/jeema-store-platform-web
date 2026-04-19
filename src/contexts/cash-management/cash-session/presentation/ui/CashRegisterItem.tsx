'use client'
import { Button } from '@/shared/ui/components/buttons'
import React, { useState } from 'react'
import { FaCashRegister, FaCircle } from 'react-icons/fa'
import { MdClosedCaption, MdClosedCaptionDisabled } from 'react-icons/md'
import { TbCashRegister } from 'react-icons/tb'
import clsx from 'clsx'
import { BiPencil } from 'react-icons/bi'
import { OpenCashSessionModal } from './OpenCashSessionModal'
import { useOpenCashSession } from '../hooks/useOpenCashSession'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/shared/ui/components/loadings/Spinner'
import { ICashRegister } from '@/contexts/cash-management/cash-register/presentation/interfaces/ICashRegister'
import { HideElement } from '@/contexts/authentication-management/auth/presentation/ui/HideElement'

interface Props {
    cashRegister: ICashRegister
}

const CashRegisterItem = ({ cashRegister }: Props) => {
    const { handleOpenOpenCasSessionModal } = useOpenCashSession();
    const [redirectCloseCash, setRedirectCloseCash] = useState(false);
    const router = useRouter();
    const handleRouter = (route: string) => {
        setRedirectCloseCash(true);
        router.push(route);
    }
    return (
        <div className="bg-white flex flex-col gap-4 rounded-2xl p-4 w-full shadow-md">
            <div className='flex justify-between items-center w-full'>
                <div className=''>
                    <FaCircle size={10} className={clsx(`text-${cashRegister.isActive ? 'green' : 'red'}-600`)} />
                </div>
                <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                    <div className=' flex gap-2'>
                        {cashRegister.isActive
                            ? <Button color='red' size='sm'><MdClosedCaptionDisabled />Desactivar</Button>
                            : <Button color='green' size='sm'><MdClosedCaption />Activar</Button>
                        }
                        <Button color='yellow' size='sm'><BiPencil />Editar</Button>
                    </div>
                </HideElement>
            </div>
            <figure className="flex justify-center text-purple-700">
                <FaCashRegister size={50} />
            </figure>
            <div className="flex justify-center">
                <h2 className="font-semibold text-lg">{cashRegister.name}</h2>
            </div>
            {cashRegister.isActive &&
                <div className="flex justify-center items-center gap-2">
                    {
                        cashRegister.cashSessions.length > 0
                            ? <Button size="sm" color="yellow" onClick={() => handleRouter('/cash/session/' + cashRegister.cashSessions[0].cashSessionId)}>
                                {redirectCloseCash ? <Spinner /> : <MdClosedCaptionDisabled />}
                                Hacer Corte
                            </Button>
                            : <Button size="sm" onClick={() => handleOpenOpenCasSessionModal(cashRegister)}><TbCashRegister /> Aperturar</Button>
                    }
                </div>
            }
            <OpenCashSessionModal />
        </div>
    )
}

export default CashRegisterItem
