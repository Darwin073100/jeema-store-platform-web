import { Button } from '@/ui/components/buttons'
import React from 'react'
import { FaCashRegister, FaCircle } from 'react-icons/fa'
import { MdClosedCaption, MdClosedCaptionDisabled } from 'react-icons/md'
import { TbCashRegister } from 'react-icons/tb'
import { CashRegisterEntity } from '../../domain/entities/cash-register.entity'
import clsx from 'clsx'
import { BiPencil } from 'react-icons/bi'

interface Props {
    cashRegister: CashRegisterEntity
}

const CashRegisterItem = ({ cashRegister }: Props) => {
  return (
    <div className="bg-white flex flex-col gap-4 rounded-2xl p-4 w-full shadow-md">
        <div className='flex justify-between items-center w-full'>
            <div className=''>
                <FaCircle size={10} className={clsx(`text-${cashRegister.isActive? 'green': 'red'}-600`)}/>
            </div>
            <div className=' flex gap-2'>
                { cashRegister.isActive
                    ? <Button color='red' size='sm'><MdClosedCaptionDisabled />Desactivar</Button>
                    :<Button color='green' size='sm'><MdClosedCaption />Activar</Button>
                }
                <Button color='yellow' size='sm'><BiPencil />Editar</Button>
            </div>
        </div>
        <figure className="flex justify-center text-purple-700">
            <FaCashRegister size={50}/>
        </figure>
        <div className="flex justify-center">
            <h2 className="font-semibold text-lg">{cashRegister.name}</h2>
        </div>
        { cashRegister.isActive &&
            <div className="flex justify-center items-center gap-2">
                {
                    cashRegister.cashSessions.length > 0 
                        ? <Button size="sm" color="yellow"><MdClosedCaptionDisabled />Hacer Corte</Button>
                        : <Button size="sm"><TbCashRegister /> Aperturar</Button>
                }
            </div>
        }
    </div>
  )
}

export default CashRegisterItem
