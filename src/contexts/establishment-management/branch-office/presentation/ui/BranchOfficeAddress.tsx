'use client'
import { Button } from '@/shared/ui/components/buttons';
import { CardGrid } from '@/shared/ui/components/grids/CardGrid';
import React from 'react'
import { PiAddressBookFill, PiCactus } from 'react-icons/pi';
import { BiPencil } from 'react-icons/bi';
import { useBranchOfficeStore } from '../stores/branch-office.store';
import { useBranchOfficeUIStore } from '../stores/branch-office-ui.store';
import { BranchOfficeUpdateAddressModal } from './BranchOfficeUpdateAddressModal';

const BranchOfficeAddress = () => {
    const { branchOffice } = useBranchOfficeStore();
    const { openBranchOfficeModal } = useBranchOfficeUIStore()
    return (
        <>
            <div className="my-4 flex gap-2 items-center">
                <PiAddressBookFill />
                <h2 className="text-lg font-bold">Dirección</h2>
                <Button size="sm" color="yellow" onClick={()=> openBranchOfficeModal('editAddress')}><BiPencil/> Editar</Button>
            </div>
            {branchOffice?.address ? <>
                <div className="grid grid-cols-4 gap-2 mb-2">
                    <CardGrid title="País" icon={<PiCactus />}>
                        {branchOffice?.address?.country}
                    </CardGrid>
                    <CardGrid title="Estado" icon={<PiCactus />}>
                        {branchOffice?.address?.state}
                    </CardGrid>
                    <CardGrid title="Municipio" icon={<PiCactus />}>
                        {branchOffice?.address?.municipality}
                    </CardGrid>
                    <CardGrid title="Código P." icon={<PiCactus />}>
                        {branchOffice?.address?.postalCode}
                    </CardGrid>
                    <CardGrid title="Ciudad" icon={<PiCactus />}>
                        {branchOffice?.address?.city}
                    </CardGrid>
                    <CardGrid title="Colonia" icon={<PiCactus />}>
                        {branchOffice?.address?.neighborhood}
                    </CardGrid>
                    <CardGrid title="Calle" icon={<PiCactus />}>
                        {branchOffice?.address?.street}
                    </CardGrid>
                    <CardGrid title="N. Interior" icon={<PiCactus />}>
                        {branchOffice?.address?.internalNumber}
                    </CardGrid>
                    <CardGrid title="N. Exterior" icon={<PiCactus />}>
                        {branchOffice?.address?.externalNumber}
                    </CardGrid>
                </div>
                <CardGrid title="Referencia" icon={<PiCactus />}>
                    {branchOffice?.address?.reference}
                </CardGrid></>
                : <span className='text-lg italic'>No se encontró la dirección</span>}
                <BranchOfficeUpdateAddressModal />
        </>
    )
}

export { BranchOfficeAddress };
