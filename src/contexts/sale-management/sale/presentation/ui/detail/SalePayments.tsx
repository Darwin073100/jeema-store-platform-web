'use client'
import React from 'react'
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { formatDateShort, formatTimeByDate } from '@/shared/lib/utils/date-formatter';
import { FcCurrencyExchange } from 'react-icons/fc';
import { IoPrintSharp } from 'react-icons/io5';
import { ISale } from '../../interfaces/ISale';
import { SaleStatusEnum } from '../../../domain/enums/sale-status.enum';
import { Button } from '@/shared/ui/components/buttons';
import { useSaleUIStore } from '../../stores/sale.ui.store';
import { CreditPaymentHistoryTicketModal } from './CreditPaymentHistoryTicketModal';
interface Props {
    data: ISale
}
const SalePayments = ({ data }: Props) => {
    const hasPayments = (data.salePayments?.length ?? 0) > 0;
    const { openSaleModal } = useSaleUIStore();

    return (
        <>
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
            {/* ... (Contenido de Pagos sigue igual) ... */}
            <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <FcCurrencyExchange />
                    <span>Pagos</span>
                </h2>
                {
                    hasPayments &&
                        <Button
                            onClick={() => openSaleModal('creditPaymentHistoryModal')}
                            className="flex items-center text-sm">
                            <IoPrintSharp />
                            <span>Imprimir historial de pagos</span>
                        </Button>
                }
            </div>
            {
                data.status === SaleStatusEnum.CREDIT &&
                    <div className="flex justify-between text-sm py-2 px-3 mb-2 rounded-md bg-orange-50 border-l-4 border-orange-400">
                        <span className="font-semibold text-orange-700">Saldo pendiente:</span>
                        <span className="font-bold text-orange-900">{numberMoneyFormat(data.balanceAmount)}</span>
                    </div>
            }
            {(data.salePayments?.length ?? 0) === 0 &&
                <p className="text-gray-500 italic text-sm">
                    {data.status === SaleStatusEnum.CREDIT ? 'Aún no se han registrado abonos.' : 'Sin pagos registrados.'}
                </p>
            }
            {data.salePayments?.map(p => (
                <div key={p.salePaymentId} className="py-2 px-3 mb-2 rounded-md bg-blue-50 border-l-4 border-blue-400">
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-700">{p?.paymentMethod?.name}</span>
                        <span className="font-bold text-gray-900">{numberMoneyFormat(p.amountPaid)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{formatDateShort(p.createdAt)} {formatTimeByDate(p.createdAt)}</span>
                        <span>{p.employee?.firstName} {p.employee?.lastName}</span>
                    </div>
                </div>
            ))}
        </div>
        {hasPayments && <CreditPaymentHistoryTicketModal saleId={data.saleId} />}
        </>
    )
}

export { SalePayments };
