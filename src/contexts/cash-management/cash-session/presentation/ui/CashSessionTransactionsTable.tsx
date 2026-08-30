'use client'
import { AccountTypeEnum } from '@/contexts/transaction-management/transaction-type/domain/enums/account-type.enum'
import { formatTimeByDate } from '@/shared/lib/utils/date-formatter'
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter'
import { PCol, PRow, PrimaryTable, PTableEmpty } from '@/shared/ui/components/tables/PrimaryTable'
import clsx from 'clsx'
import { ICashSession } from '../interfaces/ICashSession'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui/components/buttons'
import { IoIosExit } from 'react-icons/io'
import { Spinner } from '@/shared/ui/components/loadings/Spinner'
interface Props {
    data: ICashSession;
}
export const CashSessionTransactionsTable = ({ data }:Props) => {
    const headTable = ['Folio', 'Típo', 'Movimiento', 'Descripción', 'Monto', 'Hora', 'Cajero']
    const router = useRouter();

    const [saleSelectId, setSaleSelectId] = useState(BigInt(0));

    return (
        <article className="overflow-x-auto">
            <PrimaryTable theadList={headTable} isActions={true}>
                {data.transactions.map(item => (
                    <PRow key={item.transactionId}>
                        <PCol>{item.transactionId}</PCol>
                        <PCol className={clsx(`font-bold ${item.transactionType?.accountType === AccountTypeEnum.INCOME ? 'text-green-500' : 'text-red-500'}`)}>
                            {item.transactionType?.accountType}
                        </PCol>
                        <PCol>{item.transactionType?.name}</PCol>
                        <PCol>{item.description}</PCol>
                        <PCol className={clsx(`font-bold ${item.transactionType?.accountType === AccountTypeEnum.INCOME ? 'text-green-500' : 'text-red-500'}`)}>
                            {item.transactionType?.accountType === AccountTypeEnum.INCOME ? '+' : '-'}
                            {numberMoneyFormat(Number(item.amount ?? 0))}
                        </PCol>
                        <PCol>{formatTimeByDate(item.createdAt)}</PCol>
                        <PCol>{`${data.employee?.firstName ?? 'N/A'}`}</PCol>
                        {item?.saleId
                            ? <PCol className='flex justify-end'><Button size='sm' color='yellow' onClick={()=> {
                                router.push(`/sale/${item?.saleId ?? '#'}`); 
                                setSaleSelectId(BigInt(item?.saleId ?? 0))
                            }}>{BigInt(item?.saleId)===saleSelectId? <Spinner size={14}/>: <IoIosExit />} Venta</Button></PCol>
                            : <PCol></PCol>}
                    </PRow>
                ))}
                {(!data.transactions || data.transactions.length === 0) && (
                    <PTableEmpty colsNumber={headTable.length + 1} />
                )}
            </PrimaryTable>
        </article>
    )
}
