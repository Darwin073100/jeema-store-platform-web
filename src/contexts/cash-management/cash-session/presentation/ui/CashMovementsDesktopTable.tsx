'use client';
import { Button } from '@/shared/ui/components/buttons'
import React from 'react'
import { AiFillProfile } from 'react-icons/ai'
import { useRouter } from 'next/navigation';
import { formatDateShort, formatTimeByDate } from '@/shared/lib/utils/date-formatter';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { useCashStore } from '../stores/cash.store';
import { PCol, PrimaryTable, PRow } from '@/shared/ui/components/tables/PrimaryTable';

const CashMovementsDesktopTable = () => {
    
    const { cashSessions } = useCashStore();

    const router = useRouter();
    const headTable = ['Folio', 'F. Apertura', 'Apertura', 'F. Corte', 'Corte', 'Caja', 'Cajero']
    return (
        <PrimaryTable theadList={headTable}>
            {cashSessions.map(item => (
                <PRow key={item.cashSessionId}>
                    <PCol>{item.cashSessionId}</PCol>
                    <PCol>{formatDateShort(item.startTime)}{` : `}{formatTimeByDate(item.startTime)}</PCol>
                    <PCol>{numberMoneyFormat(item.startBalance)}</PCol>
                    <PCol>{formatDateShort(item.endTime)}{` : `}{formatTimeByDate(item.endTime)}</PCol>
                    <PCol>{numberMoneyFormat(Number(item.actualBalance ?? 0))}</PCol>
                    <PCol><Badge type='green'>{item.cashRegister?.name}</Badge></PCol>
                    <PCol>{`${item.employee?.firstName}`}</PCol>
                    <PCol className="text-right flex justify-end">
                        <Button onClick={()=> router.push(`session/${item.cashSessionId}`)} size='sm' title='Da click para ver el perfil del cliente.'>
                            <AiFillProfile size={14} /><span>Info.</span>
                        </Button>
                    </PCol>
                </PRow>
            ))}
        </PrimaryTable>
    )
}

export { CashMovementsDesktopTable };
