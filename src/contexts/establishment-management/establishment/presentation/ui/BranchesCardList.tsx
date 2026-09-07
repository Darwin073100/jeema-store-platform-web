'use client'
import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { Card } from '@/shared/ui/components/cards';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { useRouter } from 'next/navigation';
import React from 'react'
import { BiInfoSquare } from 'react-icons/bi';

interface Props {
    branchOffices: IBranchOffice[]
}

const BranchesCardList = ({ branchOffices }: Props) => {
    const [branchSelectedId, setBranchSelectedId] = React.useState(BigInt(0));
    const router = useRouter();
    const handleRedirect = (branchOfficeId: bigint) => {
        setBranchSelectedId(branchOfficeId);
        router.push(`/configurations/establishment/branches/${branchOfficeId.toString()}`);
    }

    if (!branchOffices || branchOffices.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 w-full text-center text-gray-500 shadow-sm">
                No hay registros...
            </div>
        );
    }

    return (
        <>
            {branchOffices.map(item => (
                <Card key={item.branchOfficeId.toString()} className="w-full">
                    <div className="flex justify-between items-start pb-2 border-b border-gray-100 mb-2">
                        <p className="text-lg font-bold text-gray-900">
                            Folio: <span className="text-blue-600">#{item.branchOfficeId}</span>
                        </p>
                        <Badge type="green">{item.deletedAt ? 'Inactiva' : 'Activa'}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div className="col-span-2">
                            <p className="text-gray-500 font-bold">Sucursal:</p>
                            <p className="text-gray-700">{item.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium">Ciudad:</p>
                            <p className="text-gray-700 font-semibold">{item.address.city}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium">Alta:</p>
                            <p className="text-gray-700 font-semibold">{formatDateShort(item.createdAt)}</p>
                        </div>
                    </div>

                    <Button
                        className="w-full mt-3"
                        size="sm"
                        color="yellow"
                        title="Da click para ver la información de la sucursal."
                        onClick={() => handleRedirect(item.branchOfficeId)}
                        disabled={item.branchOfficeId === branchSelectedId}
                    >
                        {item.branchOfficeId === branchSelectedId ? <Spinner /> : <BiInfoSquare />}
                        <span>Info.</span>
                    </Button>
                </Card>
            ))}
        </>
    )
}

export { BranchesCardList };
