'use client'
import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { PCol, PrimaryTable, PRow } from '@/shared/ui/components/tables/PrimaryTable';
import { useRouter } from 'next/navigation';
import React from 'react'
import { BiInfoSquare } from 'react-icons/bi';
interface Props {
    branchOffices: IBranchOffice[]
}
const BranchesTable = ({ branchOffices }:Props) => {
    const [branchSelectedId, setBranchSelectedId] = React.useState(BigInt(0));
    const router = useRouter();
    const handleRedirect = (branchOfficeId: bigint)=>{
        setBranchSelectedId(branchOfficeId);
        router.push(`/configurations/establishment/branches/${branchOfficeId.toString()}`);
    }
    return (
        <PrimaryTable theadList={['Folio', 'Sucursal', 'Ciudad', 'Estado', 'Alta']}>
            {branchOffices.map(item => <>
                <PRow>
                    <PCol>{item.branchOfficeId}</PCol>
                    <PCol>{item.name}</PCol>
                    <PCol>{item.address.city}</PCol>
                    <PCol><Badge type="green">{item.deletedAt ? 'Inactiva' : 'Activa'}</Badge></PCol>
                    <PCol>{formatDateShort(item.createdAt)}</PCol>
                    <PCol className="flex justify-end">
                        <Button size="sm" color="yellow" onClick={()=> handleRedirect(item.branchOfficeId)} disabled={item.branchOfficeId === branchSelectedId}>
                            {item.branchOfficeId === branchSelectedId? <Spinner />: <BiInfoSquare/>}
                            Info.
                        </Button>
                    </PCol>
                </PRow>
            </>)}
        </PrimaryTable>
    )
}

export { BranchesTable };