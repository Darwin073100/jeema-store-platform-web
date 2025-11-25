import { CashSessionEntity } from '@/features/cash/domain/entities/cash-session.entity';
import React from 'react'
import { FcBullish } from 'react-icons/fc';
import { CashTransaction } from './CashTransaction';
import { AccountTypeEnum } from '@/features/transaction/domain/enums/account-type.enum';
interface Props {
    cashSession: CashSessionEntity
}
const CashIn = ({cashSession}:Props) => {
    return (
        <section className="flex flex-col gap-4">
            <div className="bg-green-50 p-4 rounded-2xl flex gap-4 items-center text-lg shadow-lg">
                <FcBullish /> <span>Ingresos</span>
            </div>
            {cashSession.transactions.map(item => <>
                {item.transactionType?.accountType === AccountTypeEnum.INCOME? <>
                    <CashTransaction
                        key={item.transactionId}
                        type="in"
                        transaction={item} />
                </>: null}
            </>)}
        </section>
    )
}

export { CashIn };
