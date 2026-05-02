'use client';
import { Button } from '@/shared/ui/components/buttons'
import React from 'react'
import { AiFillProfile } from 'react-icons/ai'
import { useRouter } from 'next/navigation';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { PCol, PrimaryTable, PRow } from '@/shared/ui/components/tables/PrimaryTable';
import { useTransactionStore } from '../stores/transaction.store';
interface Props {
}
const TransactionMovementsDesktopTable = ({ }: Props) => {
    const router = useRouter();
    const { transactionsFiltered} = useTransactionStore();
    const headTable = ['Folio', 'Monto', 'Tipo', 'F. Corte', 'Empleado', 'Sucursal', 'Fecha'];

    return (
        <PrimaryTable theadList={headTable}>
            {transactionsFiltered.map(item => (
                <PRow key={item.transactionId}>
                    <PCol>{item.transactionId}</PCol>
                    <PCol>{numberMoneyFormat(item.amount ?? 0)}</PCol>
                    <PCol><Badge type={item.transactionType?.accountType==='Ingreso'? 'green': 'red'}>{item.transactionType?.accountType}</Badge></PCol>
                    <PCol>{item.description}</PCol>
                    <PCol>{item.employee?.firstName}</PCol>
                    <PCol>{item.branchOffice?.name}</PCol>
                    <PCol>{formatDateShort(item.createdAt)}</PCol>
                    <PCol className="text-right flex justify-end">
                        <Button onClick={()=> router.push(`session/${item.transactionId}`)} size='sm' title='Da click para ver el perfil del cliente.'>
                            <AiFillProfile size={14} /><span>Info.</span>
                        </Button>
                    </PCol>
                </PRow>
            ))}
        </PrimaryTable>
    )
}

export { TransactionMovementsDesktopTable };
