import { TransactionEntity } from '@/features/transaction/domain/entities/transaction.entity';
import { formatTimeByDate } from '@/shared/lib/utils/date-formatter';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { Badge } from '@/ui/components/badges/Badge';
import clsx from 'clsx';
import React from 'react'
interface Props {
    transaction: TransactionEntity,
    /**
     * Define in=Ingreso, out=Egreso
     */
    type: 'in' | 'out'
}
const CashTransaction = ({ transaction, type }:Props) => {
    const color = type==='in'? 'green': 'red';

    return (
        <div className={clsx(`p-4 rounded-2xl bg-${color}-50 shadow-lg`)}>
            <div className="flex justify-between font-semibold">
                <h2>{transaction.transactionType?.name}</h2>
                <span>{formatTimeByDate(transaction.createdAt)}</span>
            </div>
            <div className="flex justify-between">
                <p>{transaction.description}</p>
                <div>
                    <Badge type={color}>{transaction.transactionType?.accountType}</Badge>
                    <span className={clsx(`text-${color}-700`)}>{`${type==='out'?'- ': ''}${numberMoneyFormat(transaction.amount)}`}</span>
                </div>
            </div>
        </div>
    )
}

export { CashTransaction };
