'use client';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import React, { useEffect } from 'react'
import { IoMdAdd } from 'react-icons/io';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import { HideElement } from '@/features/auth/ui/HideElement';
import { useSuplierStore } from '../stores/suplier.store';
import { useSuplierActionsBar } from '../hooks/useSuplierActionsBar';
import { ISuplier } from '../interfaces/ISuplier';
interface Props{
    data: ISuplier[]
}
const SuplierActionsBar = ({ data }:Props) => {
    const { supliersFiltered, setSupliers } = useSuplierStore();
    const {newSuplierPage, handleDownloadExcel, loading} = useSuplierActionsBar();
    useEffect(()=>{
        setSupliers(data);
    },[data]);

    return (
        <div className="flex justify-between gap-2">
            <div className='flex items-center gap-2'>
                    <Button color="blue" size="md" onClick={()=> newSuplierPage()}>
                        {loading? <Spinner/>: <IoMdAdd size={14}/>}
                        <span className='max-sm:hidden'>Nuevo Proveedor</span>
                    </Button>
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
                        Proveedores<Badge>{supliersFiltered.length}</Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { SuplierActionsBar };
