import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice'
import { formatDateShort } from '@/shared/lib/utils/date-formatter'
import { Badge } from '@/shared/ui/components/badges/Badge'
import { Button } from '@/shared/ui/components/buttons'
import { PCol, PrimaryTable, PRow } from '@/shared/ui/components/tables/PrimaryTable'
import React from 'react'
import { BiInfoSquare } from 'react-icons/bi'

interface Props {
    branchOffices: IBranchOffice[]
}

const BranchesInEstablishment = ({ branchOffices }: Props) => {
    return (
        <div className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sucursales
            </h3>
            <PrimaryTable theadList={['Folio', 'Sucursal', 'Ciudad', 'Estado', 'Alta']}>
                {branchOffices.map(item => <>
                    <PRow>
                        <PCol>{item.branchOfficeId}</PCol>
                        <PCol>{item.name}</PCol>
                        <PCol>{item.address.city}</PCol>
                        <PCol><Badge type="green">{item.deletedAt ? 'Inactiva' : 'Activa'}</Badge></PCol>
                        <PCol>{formatDateShort(item.createdAt)}</PCol>
                        <PCol className="flex justify-end"><Button size="sm" color="yellow"><BiInfoSquare></BiInfoSquare>Info.</Button></PCol>
                    </PRow>
                </>)}
            </PrimaryTable>
        </div>
    )
}

export { BranchesInEstablishment };
