import React from 'react'
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { FcCurrencyExchange } from 'react-icons/fc';
import { ISale } from '../../interfaces/ISale';
interface Props {
    data: ISale
}
const SalePayments = ({ data }: Props) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
            {/* ... (Contenido de Pagos sigue igual) ... */}
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                <FcCurrencyExchange />
                <span>Pagos</span>
            </h2>
            {data.salePayments?.map(p => (
                <div key={p.salePaymentId} className="py-2 px-3 mb-2 rounded-md bg-blue-50 border-l-4 border-blue-400">
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-700">{p?.paymentMethod?.name}</span>
                        <span className="font-bold text-gray-900">{numberMoneyFormat(p.amountPaid)}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export { SalePayments };
