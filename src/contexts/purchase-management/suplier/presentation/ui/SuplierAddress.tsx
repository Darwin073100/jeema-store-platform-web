'use client'
import { Button } from '@/shared/ui/components/buttons';
import { CardGrid } from '@/shared/ui/components/grids/CardGrid';
import React from 'react'
import { PiAddressBookFill, PiCactus } from 'react-icons/pi';
import { useSuplierStore } from '../stores/suplier.store';
import { SuplierAddAddressModal } from './SuplierAddAddressModal';
import { useSuplierUIStore } from '../stores/suplier-ui.store';

const SuplierAddress = () => {
    const { suplier } = useSuplierStore();
    const { openSuplierModal } = useSuplierUIStore();
    return (
        <>
            <div className="my-4 flex gap-2 items-center">
                <PiAddressBookFill />
                <h2 className="text-lg font-bold">Dirección</h2>
                {suplier?.address
                    ?<Button size="sm" color="yellow">Editar</Button>
                    :<Button size="sm" onClick={()=> openSuplierModal('addAddress')}>Agregar</Button>}
            </div>
            {suplier?.address ? <>
                <div className="grid grid-cols-4 gap-2 mb-2">
                    <CardGrid title="País" icon={<PiCactus />}>
                        {suplier?.address?.country}
                    </CardGrid>
                    <CardGrid title="Estado" icon={<PiCactus />}>
                        {suplier?.address?.state}
                    </CardGrid>
                    <CardGrid title="Municipio" icon={<PiCactus />}>
                        {suplier?.address?.municipality}
                    </CardGrid>
                    <CardGrid title="Código P." icon={<PiCactus />}>
                        {suplier?.address?.postalCode}
                    </CardGrid>
                    <CardGrid title="Ciudad" icon={<PiCactus />}>
                        {suplier?.address?.city}
                    </CardGrid>
                    <CardGrid title="Colonia" icon={<PiCactus />}>
                        {suplier?.address?.neighborhood}
                    </CardGrid>
                    <CardGrid title="Calle" icon={<PiCactus />}>
                        {suplier?.address?.street}
                    </CardGrid>
                    <CardGrid title="N. Interior" icon={<PiCactus />}>
                        {suplier?.address?.internalNumber}
                    </CardGrid>
                    <CardGrid title="N. Exterior" icon={<PiCactus />}>
                        {suplier?.address?.externalNumber}
                    </CardGrid>
                </div>
                <CardGrid title="Referencia" icon={<PiCactus />}>
                    {suplier?.address?.reference}
                </CardGrid></>
                : <span className='text-lg italic'>No se encontró la dirección</span>}
                <SuplierAddAddressModal />
        </>
    )
}

export { SuplierAddress };
