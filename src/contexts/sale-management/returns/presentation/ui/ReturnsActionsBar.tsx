'use client';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import { downloadXLSX } from '@/shared/lib/utils/download.excel';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { IReturns } from '../interfaces/IReturns';
interface Props{
    returns: IReturns[]
}
const ReturnsActionsBar = ({ returns }:Props) => {
    const [loading, setLoading] = useState(false);
    const newProductPage = ()=> {
        setLoading(true);
        router.push('')
    }
    const router = useRouter();

    const currentReturns = returns.map(item => {
        const base = {
            'FOLIO': item.returnsId,
            'PRODUCTO': item.saleDetail?.productNameAtSale,
            'P. UNITARIO': item.saleDetail?.unitPriceAtSale,
            'UNIDADES DEVUELTAS': item.quantityReturn,
            'MONTO DEVUELTO': item.amountReturn,
            'EMPLEADO': `${item.employee?.firstName} ${item.employee?.lastName}`,
            'FECHA': formatDateShort(item.updatedAt ?? item.createdAt)
        } as Record<string, any>;
        return base;
    });
    const handleDownloadExcel = ()=> {
        downloadXLSX(currentReturns, 'Devoluciones');
    }

    return (
        <div className="flex justify-between gap-2">
            <div className='flex items-center gap-2'>
            </div>
            <div className="flex gap-4 items-center justify-between">
                <div className='flex gap-4 items-center'>
                    <Button disabled={loading} color='green' onClick={()=> handleDownloadExcel()}>
                        <PiMicrosoftExcelLogoFill />
                        <span className='max-md:hidden'>Exportar a Excel</span>
                    </Button>
                    <div>
                        Devoluciones<Badge>{returns.length}</Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { ReturnsActionsBar };
