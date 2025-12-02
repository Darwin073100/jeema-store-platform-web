'use client';
import { Button } from '@/ui/components/buttons'
import { BasicTable, BCol, BRow } from '@/ui/components/tables/BasicTable'
import React from 'react'
import { AiFillProfile } from 'react-icons/ai'
import { useRouter } from 'next/navigation';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { Badge } from '@/ui/components/badges/Badge';
import { TransactionEntity } from '../domain/entities/transaction.entity';
interface Props {
    transactions: TransactionEntity[]
}
const TransactionMovementsDesktopTable = ({ transactions }: Props) => {
    const router = useRouter();
    const headTable = ['Folio', 'Monto', 'Tipo', 'F. Corte', 'Empleado', 'Sucursal', 'Fecha'];

    return (
        <BasicTable theadList={headTable}>
            {transactions.map(item => (
                <BRow key={item.transactionId}>
                    <BCol>{item.transactionId}</BCol>
                    <BCol>{numberMoneyFormat(item.amount ?? 0)}</BCol>
                    <BCol><Badge type={item.transactionType?.accountType==='Ingreso'? 'green': 'red'}>{item.transactionType?.accountType}</Badge></BCol>
                    <BCol>{item.description}</BCol>
                    <BCol>{item.employee?.firstName}</BCol>
                    <BCol>{item.branchOffice?.name}</BCol>
                    <BCol>{formatDateShort(item.createdAt)}</BCol>
                    <BCol className="text-right flex justify-end">
                        <Button onClick={()=> router.push(`session/${item.transactionId}`)} color='yellow' size='sm' title='Da click para ver el perfil del cliente.'>
                            <AiFillProfile size={14} /><span>Info.</span>
                        </Button>
                    </BCol>
                </BRow>
            ))}
        </BasicTable>
    )
}

export { TransactionMovementsDesktopTable };
