'use client'
import React, { useEffect } from 'react'
import { Button } from '@/shared/ui/components/buttons';
import { CardGrid } from '@/shared/ui/components/grids/CardGrid';
import { BiPencil, BiSolidPurchaseTag, BiTrash } from 'react-icons/bi';
import { PiCactus } from 'react-icons/pi';
import { formatDate } from '@/shared/lib/utils/date-formatter';
import { IBranchOffice } from '../interfaces/IBranchOffice';
import { useBranchOfficeStore } from '../stores/branch-office.store';
interface Props {
    branchOffice: IBranchOffice
}
const BranchOfficeInformation = ({ branchOffice }:Props) => {
    const { setBranchOffice } = useBranchOfficeStore();
    
    useEffect(()=> {
        setBranchOffice(branchOffice);
    }, [branchOffice]);

    return (
        <>
            <div className="my-4 flex gap-2 items-center">
                <BiSolidPurchaseTag />
                <h2 className="text-lg font-bold">Sucursal</h2>
                <Button size="sm" color="yellow"><BiPencil/> Editar</Button>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-2">
                <CardGrid title="Nombre" icon={<PiCactus />}>
                    {branchOffice.name}
                </CardGrid>
                <CardGrid title="Alta" icon={<PiCactus />}>
                    {formatDate(branchOffice.createdAt)}
                </CardGrid>
                <CardGrid title="Edición" icon={<PiCactus />}>
                    {formatDate(branchOffice.updatedAt)}
                </CardGrid>
            </div>
            {/* <FloatMessage
                {...floatMessageState} /> */}
        </>
    )
}

export { BranchOfficeInformation };
