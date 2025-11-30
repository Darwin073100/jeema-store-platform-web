'use client';
import { Button } from '@/ui/components/buttons'
import { BasicTable, BCol, BRow } from '@/ui/components/tables/BasicTable'
import React from 'react'
import { AiFillProfile } from 'react-icons/ai'
import { useRouter } from 'next/navigation';
import { CashSessionEntity } from '../../domain/entities/cash-session.entity';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { Badge } from '@/ui/components/badges/Badge';
interface Props {
    cashSessions: CashSessionEntity[]
}
const CashMovementsDesktopTable = ({ cashSessions }: Props) => {
    const router = useRouter();
    const headTable = ['Folio', 'F. Apertura', 'Monto', 'F. Corte', 'Monto', 'Caja', 'Cajero']
    return (
        <BasicTable theadList={headTable}>
            {cashSessions.map(item => (
                <BRow>
                    <BCol>{item.cashSessionId}</BCol>
                    <BCol>{formatDateShort(item.startTime)}</BCol>
                    <BCol>{numberMoneyFormat(item.startBalance)}</BCol>
                    <BCol>{formatDateShort(item.endTime)}</BCol>
                    <BCol>{numberMoneyFormat(item.actualBalance ?? 0)}</BCol>
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
