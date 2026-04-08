'use client';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import { downloadXLSX } from '@/shared/lib/utils/download.excel';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { numberBasicFormat } from '@/shared/lib/utils/number-formatter';
import { IoReturnDownBack } from 'react-icons/io5';
import { HideElement } from '@/contexts/authentication-management/auth/presentation/ui/HideElement';
import { ISale } from '../interfaces/ISale';
interface Props{
    sales: ISale[]
}
const SaleActionsBar = ({ sales }:Props) => {
    const [loading, setLoading] = useState(false);
    const redirectPage = ()=> {
        setLoading(true);
        router.push('sale/returns')
    }
    const router = useRouter();

    const currentSales = sales.map(item => {
        const base = {
            'FOLIO': item.saleId,
            'CLIENTE': `${item.customer?.firstName} ${item.customer?.lastName}`,
            'EMPLEADO': `${item.employee?.firstName} ${item.employee?.lastName}`,
            'STATUS': item.status,
            'TOTAL': numberBasicFormat(item.totalAmount),
            'FECHA': formatDateShort(item.createdAt),
        } as Record<string, any>;
        return base;
    });
    const handleDownloadExcel = ()=> {
        downloadXLSX(currentSales, 'Ventas');
    }

    return (
        <div className="flex justify-between gap-2">
            <div className='flex items-center gap-2'>
                <Button color="yellow" size="md" onClick={()=> redirectPage()}>
                    {loading? <Spinner/>: <IoReturnDownBack size={14}/>}
                    <span className='max-sm:hidden'>Ver devoluciones</span>
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
                        Ventas<Badge>{sales.length}</Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { SaleActionsBar };
