'use client';
import { Button } from '@/shared/ui/components/buttons'
import { BasicTable, BCol, BRow } from '@/shared/ui/components/tables/BasicTable'
import React from 'react'
import { AiFillProfile } from 'react-icons/ai'
import { useRouter } from 'next/navigation';
import { formatDateShort, formatTimeByDate } from '@/shared/lib/utils/date-formatter';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { useCashStore } from '../../infraestructure/stores/cash.store';

const CashMovementsDesktopTable = () => {
    
    const { cashSessions } = useCashStore();

    const router = useRouter();
    const headTable = ['Folio', 'F. Apertura', 'Apertura', 'F. Corte', 'Corte', 'Caja', 'Cajero']
    return (
        <BasicTable theadList={headTable}>
            {cashSessions.map(item => (
                <BRow key={item.cashSessionId}>
                    <BCol>{item.cashSessionId}</BCol>
                    <BCol>{formatDateShort(item.startTime)}{` : `}{formatTimeByDate(item.startTime)}</BCol>
                    <BCol>{numberMoneyFormat(item.startBalance)}</BCol>
                    <BCol>{formatDateShort(item.endTime)}{` : `}{formatTimeByDate(item.endTime)}</BCol>
                    <BCol>{numberMoneyFormat(Number(item.actualBalance ?? 0))}</BCol>
                    <BCol><Badge type='green'>{item.cashRegister?.name}</Badge></BCol>
                    <BCol>{`${item.employee?.firstName}`}</BCol>
                    <BCol className="text-right flex justify-end">
                        <Button onClick={()=> router.push(`session/${item.cashSessionId}`)} color='yellow' size='sm' title='Da click para ver el perfil del cliente.'>
                            <AiFillProfile size={14} /><span>Info.</span>
                        </Button>
                    </BCol>
                </BRow>
            ))}
        </BasicTable>
    )
}

export { CashMovementsDesktopTable };
