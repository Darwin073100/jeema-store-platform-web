'use client'
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { TextInput } from '@/shared/ui/components/inputs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { FaFilter } from 'react-icons/fa';
import { TransactionEntity } from '../domain/entities/transaction.entity';
import { downloadXLSX } from '@/shared/lib/utils/download.excel';
import { TransactionExcel } from '../domain/excel-interfaces/transaction.excel';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
interface Props {
    transactions: TransactionEntity[]
}
const TransactionMovementsOptios = ({ transactions }: Props) => {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const handleNewEmployee = () => {
        setLoading(true);
        router.push('/customers/new');
    }
    const dataExcel: TransactionExcel[] = transactions.map(item => ({
        FOLIO: item.transactionId,
        MONTO: Number(item.amount.toFixed(2)),
        TIPO: item.transactionType?.accountType ?? '',
        DESCRIPCION: item.transactionType?.name ?? '',
        NOTA: item.description ?? '',
        EMPLEADO: `${item.employee?.firstName ?? ''} ${item.employee?.lastName ?? ''}`,
        SUCURSAL: item.branchOffice?.name ?? '',
        CAJA: '',
        FECHA: formatDateShort(item.updatedAt?? item.createdAt)
    }));
    const handleExport = () => {
    // Llama a la función de descarga con tu array y el nombre deseado
        downloadXLSX(dataExcel, 'reporte_movimientos');
    };

    return (
        <>
            <div className="flex gap-4 items-center justify-between">
                <span></span>
                <div className='flex gap-4 items-center'>
                    <Button disabled={loading} color='green' onClick={()=> handleExport()}>
                        <PiMicrosoftExcelLogoFill />
                        Exportar a Excel
                    </Button>
                    <div>
                        Movimientos<Badge>{transactions.length}</Badge>
                    </div>
                </div>
            </div>
            <div className='flex gap-4'>
                <div>
                    Fecha de inicio
                    <TextInput
                    type='date' />
                </div>
                <div>
                    Fecha de límite
                    <TextInput
                    type='date' />
                </div>
                <div className='flex items-end'>
                    <Button disabled={loading} color='yellow'>
                        <FaFilter />
                        Aplicar filtro
                    </Button>
                </div>
            </div>
        </>
    )
}

export { TransactionMovementsOptios };
