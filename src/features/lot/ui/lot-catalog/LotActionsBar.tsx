'use client';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import React, { useEffect } from 'react'
import { IoMdAdd } from 'react-icons/io';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import { HideElement } from '@/features/auth/ui/HideElement';
import { LotEntity } from '../../domain/entities/lot.entity';
import { useLotStore } from '../../infraestructure/store/lot.store';
import { useLotActionsBar } from '../../hooks/useLotActionsBar';
interface Props{
    data: LotEntity[]
}
const LotActionsBar = ({ data }:Props) => {
    const { lotsFiltered, setLots } = useLotStore();
    const {newProductPage, handleDownloadExcel, loading} = useLotActionsBar();
    
    useEffect(()=>{
        setLots(data);
    },[data]);

    return (
        <div className="flex justify-between gap-2">
            <div className='flex items-center gap-2'>
                <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                    <Button color="blue" size="md" onClick={()=> newProductPage()}>
                        {loading? <Spinner/>: <IoMdAdd size={14}/>}
                        <span className='max-sm:hidden'>Nuevo Producto</span>
                    </Button>
                </HideElement>
            </div>
            <div className="flex gap-4 items-center justify-between">
                <div className='flex gap-4 items-center'>
                    <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                        <Button disabled={loading} color='green' onClick={()=> handleDownloadExcel()}>
                            <PiMicrosoftExcelLogoFill />
                            <span className='max-md:hidden'>Exportar a Excel</span>
                        </Button>
                    </HideElement>
                    <div>
                        Compras<Badge>{lotsFiltered.length}</Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { LotActionsBar };
