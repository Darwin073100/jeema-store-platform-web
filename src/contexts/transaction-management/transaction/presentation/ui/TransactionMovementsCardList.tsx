'use client'
import { Badge } from '@/shared/ui/components/badges/Badge'
import { Button } from '@/shared/ui/components/buttons'
import { Card } from '@/shared/ui/components/cards'
import { formatDateShort } from '@/shared/lib/utils/date-formatter'
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter'
import { AiFillProfile } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import { useTransactionStore } from '../stores/transaction.store'

const TransactionMovementsCardList = () => {
    const router = useRouter();
    const { transactionsFiltered } = useTransactionStore();

    if (!transactionsFiltered || transactionsFiltered.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 w-full text-center text-gray-500 shadow-sm">
                No hay registros...
            </div>
        );
    }

    return (
        <>
            {transactionsFiltered.map(item => {
                const isIncome = item.transactionType?.accountType === 'Ingreso';
                return (
                    <Card key={item.transactionId.toString()} className="w-full">
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
                                <p className="text-gray-500 font-bold">Clasificación:</p>
                                <p className="text-gray-700">{item.transactionType?.name ?? '-'}</p>
                            </div>
                            {item.description &&
                                <div className="col-span-2">
                                    <p className="text-gray-500 font-bold">Descripción:</p>
                                    <p className="text-gray-700 break-words">{item.description}</p>
                                </div>
                            }
                            <div>
                                <p className="text-gray-500 font-medium">Empleado:</p>
                                <p className="text-gray-700 font-semibold">{item.employee?.firstName ?? 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">Sucursal:</p>
                                <p className="text-gray-700 font-semibold">{item.branchOffice?.name ?? 'N/A'}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-500 font-medium">Fecha:</p>
                                <p className="text-gray-700 font-semibold">{formatDateShort(item.createdAt)}</p>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-500 font-medium">
                                Monto:
                                <span className={`text-lg font-extrabold ml-1 ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                                    {numberMoneyFormat(item.amount ?? 0)}
                                </span>
                            </p>
                        </div>

                        <Button
                            className="w-full mt-3"
                            size="sm"
                            title='Da click para ver el perfil del cliente.'
                            onClick={() => router.push(`session/${item.transactionId}`)}
                        >
                            <AiFillProfile size={14} /> Info.
                        </Button>
                    </Card>
                );
            })}
        </>
    )
}

export { TransactionMovementsCardList };
