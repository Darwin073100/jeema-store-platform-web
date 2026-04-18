import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice'
import React from 'react'
import { BranchesTable } from './BranchesTable'

interface Props {
    branchOffices: IBranchOffice[]
}

const BranchesInEstablishment = ({ branchOffices }: Props) => {
    return (
        <div className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sucursales
            </h3>
            <BranchesTable 
                branchOffices={branchOffices}/>
        </div>
    )
}

export { BranchesInEstablishment };
