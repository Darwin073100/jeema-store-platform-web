'use client'
import { AccountTypeEnum } from '@/contexts/transaction-management/transaction-type/domain/enums/account-type.enum'
import { formatTimeByDate } from '@/shared/lib/utils/date-formatter'
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter'
import { Card } from '@/shared/ui/components/cards'
import { Badge } from '@/shared/ui/components/badges/Badge'
import { Button } from '@/shared/ui/components/buttons'
import { Spinner } from '@/shared/ui/components/loadings/Spinner'
import { IoIosExit } from 'react-icons/io'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ICashSession } from '../interfaces/ICashSession'

interface Props {
    data: ICashSession;
}

export const CashSessionTransactionsCardList = ({ data }: Props) => {
    const router = useRouter();
    const [saleSelectId, setSaleSelectId] = useState(BigInt(0));

    if (!data.transactions || data.transactions.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 w-full text-center text-gray-500 shadow-sm">
                No hay registros...
            </div>
        );
    }

    return (
        <>
            {data.transactions.map(item => {
                const isIncome = item.transactionType?.accountType === AccountTypeEnum.INCOME;
                return (
                    <Card key={item.transactionId} className="w-full">
                        <div className="flex justify-between items-start pb-2 border-b border-gray-100 mb-2">
                            <p className="text-lg font-bold text-gray-900">
                                Folio: <span className="text-blue-600">#{item.transactionId}</span>
                            </p>
                            <Badge type={isIncome ? 'green' : 'red'}>
                                {item.transactionType?.accountType}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="col-span-2">
                                <p className="text-gray-500 font-bold">Movimiento:</p>
                                <p className="text-gray-700">{item.transactionType?.name ?? '-'}</p>
                            </div>
                            {item.description &&
                                <div className="col-span-2">
                                    <p className="text-gray-500 font-bold">Descripción:</p>
                                    <p className="text-gray-700 break-words">{item.description}</p>
                                </div>
                            }
                            <div>
                                <p className="text-gray-500 font-medium">Hora:</p>
                                <p className="text-gray-700 font-semibold">{formatTimeByDate(item.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">Cajero:</p>
                                <p className="text-gray-700 font-semibold">{data.employee?.firstName ?? 'N/A'}</p>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-500 font-medium">
                                Monto:
                                <span className={`text-lg font-extrabold ml-1 ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                                    {isIncome ? '+' : '-'}{numberMoneyFormat(Number(item.amount ?? 0))}
                                </span>
                            </p>
                        </div>

                        {item?.saleId &&
                            <Button className="w-full mt-3" size="sm" color="yellow" onClick={() => {
                                router.push(`/sale/${item?.saleId ?? '#'}`);
                                setSaleSelectId(BigInt(item?.saleId ?? 0));
                            }}>
                                {BigInt(item?.saleId) === saleSelectId ? <Spinner size={14} /> : <IoIosExit />} Ver Venta
                            </Button>
                        }
                    </Card>
                );
            })}
        </>
    )
}
