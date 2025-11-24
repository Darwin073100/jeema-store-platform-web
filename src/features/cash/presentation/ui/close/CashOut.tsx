import { CashSessionEntity } from '@/features/cash/domain/entities/cash-session.entity';
import React from 'react'
import { FcBearish } from 'react-icons/fc';
import { CashTransaction } from './CashTransaction';
interface Props {
    cashSession: CashSessionEntity
}
const CashOut = ({cashSession}:Props) => {
    return (
        <section className="flex flex-col gap-4">
            <div className="bg-red-50 p-4 rounded-2xl flex gap-4 items-center text-lg shadow-lg">
                <FcBearish /> <span>Egresos</span>
            </div>
            {cashSession.transactions.map(item => <>
                <CashTransaction
                    type="out"
                    transaction={item} />
            </>)}
        </section>
    )
}

export { CashOut };
