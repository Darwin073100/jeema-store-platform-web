'use client'
import React, { useEffect } from 'react'
import { Button } from '@/shared/ui/components/buttons';
import { CardGrid } from '@/shared/ui/components/grids/CardGrid';
import { BiPencil, BiSolidPurchaseTag, BiTrash } from 'react-icons/bi';
import { PiCactus } from 'react-icons/pi';
import { ISuplier } from '../interfaces/ISuplier';
import { formatDate } from '@/shared/lib/utils/date-formatter';
import { useSuplierStore } from '../stores/suplier.store';
import { FloatMessage } from '@/shared/ui/components/messages';
import { useSuplierUIStore } from '../stores/suplier-ui.store';
import { SuplierUpdateModal } from './SuplierUpdateModal';
interface Props {
    suplier: ISuplier
}
const SuplierInformation = ({ suplier }:Props) => {
    const { setSuplier } = useSuplierStore();
    const { floatMessageState, openSuplierModal } = useSuplierUIStore();
    
    useEffect(()=> {
        setSuplier(suplier);
    }, [suplier]);

    return (
        <>
            <div className="my-4 flex gap-2 items-center">
                <BiSolidPurchaseTag />
                <h2 className="text-lg font-bold">Proveedor</h2>
                <Button size="sm" color="yellow" onClick={()=> openSuplierModal('editSuplier')}><BiPencil/> Editar</Button>
                <Button size="sm" color="red"><BiTrash/> Eliminar</Button>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-2">
                <CardGrid title="Nombre" icon={<PiCactus />}>
                    {suplier.name}
                </CardGrid>
                <CardGrid title="Persona" icon={<PiCactus />}>
                    {suplier.contactPerson}
                </CardGrid>
                <CardGrid title="Correo" icon={<PiCactus />}>
                    {suplier.email}
                </CardGrid>
                <CardGrid title="Teléfono" icon={<PiCactus />}>
                    {suplier.phoneNumber}
                </CardGrid>
                <CardGrid title="RFC" icon={<PiCactus />}>
                    {suplier.rfc}
                </CardGrid>
                <CardGrid title="Alta" icon={<PiCactus />}>
                    {formatDate(suplier.createdAt)}
                </CardGrid>
                <CardGrid title="Edición" icon={<PiCactus />}>
                    {formatDate(suplier.updatedAt)}
                </CardGrid>
            </div>
            <CardGrid title="Notas" icon={<PiCactus />}>
                {suplier.notes}
            </CardGrid>
            <SuplierUpdateModal />
            <FloatMessage
                {...floatMessageState} />
        </>
    )
}

export { SuplierInformation };
