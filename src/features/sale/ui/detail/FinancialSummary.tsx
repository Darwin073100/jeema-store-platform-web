import React from 'react'
import { SaleEntity } from '../../domain/entities/sale-entity';
import { numberBasicFormat, numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { FcBullish } from 'react-icons/fc';

interface Props {
    data: SaleEntity
}
const FinancialSummary = ({ data }: Props) => {

    return (
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                <FcBullish />
                <span>Resumen Financiero</span>
            </h2>
            <div className="p-4 bg-gray-50 rounded-lg">

                <div className="flex justify-between items-center py-1">
                    <span className="text-gray-700">Subtotal (sin IVA):</span>
                    <span className="font-medium text-gray-800">{numberMoneyFormat(data.subTotalAmount)}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                    <span className="text-gray-700">Impuestos (IVA):</span>
                    <span className="font-medium text-gray-800">{numberMoneyFormat(data.taxAmount)}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                    <span className="text-gray-700">Descuento Total:</span>
                    <span className={`font-medium ${parseFloat(data?.discountAmount.toString()) > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                        -{numberMoneyFormat(data.discountAmount)}
                    </span>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-300 flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">TOTAL FINAL:</span>
                    <span className="text-3xl font-extrabold text-blue-700">
                        {numberMoneyFormat(data.totalAmount)}
                    </span>
                </div>
            </div>
        </div>
    )
}

export { FinancialSummary };
