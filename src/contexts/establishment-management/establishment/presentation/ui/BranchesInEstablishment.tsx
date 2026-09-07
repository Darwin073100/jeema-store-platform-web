import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice'
import React from 'react'
import { BranchesTable } from './BranchesTable'
import { BranchesCardList } from './BranchesCardList'

interface Props {
    branchOffices: IBranchOffice[]
}

const BranchesInEstablishment = ({ branchOffices }: Props) => {
    return (
        <div className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sucursales
            </h3>
            <div className="hidden md:block overflow-x-auto">
                <BranchesTable
                    branchOffices={branchOffices}/>
            </div>
            <div className="md:hidden flex flex-col gap-3 w-full">
                <BranchesCardList
                    branchOffices={branchOffices}/>
            </div>
        </div>
    )
}

export { BranchesInEstablishment };
