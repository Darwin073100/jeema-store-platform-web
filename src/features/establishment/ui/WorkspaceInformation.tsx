'use client'
import React from 'react'
import { formatDateWithOutTime } from '@/shared/lib/utils/date-formatter'
import { Badge } from '@/shared/ui/components/badges/Badge'
import { ButtonOutLine } from '@/shared/ui/components/buttons/ButtonOutLine'
import { BiAddToQueue, BiCalendar, BiPencil } from 'react-icons/bi'
import { EstablishmentEntity } from '../domain/entities/establishment.entity'

interface Props {
    establishment: EstablishmentEntity
}

const WorkspaceInformation = ({ establishment }: Props) => {
    return (
        <div className="bg-white rounded-lg shadow-md w-full p-6 flex flex-col justify-center gap-4">
            <div className="flex items-center gap-4">
                <Badge>FOLIO {establishment?.establishmentId}</Badge>
            </div>
            <div>
                <h1 className="font-bold text-[12px] text-gray-500">NOMBRE COMERCIAL</h1>
                <span className="text-sm font-bold">{establishment?.name}</span>
            </div>
            <div>
                <h1 className="font-bold text-[12px] text-gray-500">FECHA DE REGISTRO</h1>
                <span className="text-sm font-bold text-gray-400"><BiCalendar></BiCalendar> {formatDateWithOutTime(establishment?.createdAt)}</span>
            </div>
            <div className="flex flex-col w-full gap-2">
                <ButtonOutLine className="w-full"><BiPencil></BiPencil>Editar información</ButtonOutLine>
                <ButtonOutLine color="purple" className="w-full"><BiAddToQueue></BiAddToQueue>Agregar sucursal</ButtonOutLine>
            </div>
        </div>
    )
}

export { WorkspaceInformation };
