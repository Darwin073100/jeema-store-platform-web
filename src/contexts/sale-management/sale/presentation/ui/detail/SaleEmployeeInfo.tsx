import { formatDate } from '@/shared/lib/utils/date-formatter';
import React from 'react'
import { FcKindle } from 'react-icons/fc';
import { ISale } from '../../interfaces/ISale';
interface Props {
    data: ISale
}
const SaleEmployeeInfo = ({ data }: Props) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
            {/* ... (Contenido de Transacción sigue igual) ... */}
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                <FcKindle />
                <span>Información de adicional</span>
            </h2>
            <dl className="text-sm">
                <div className="py-2">
                    <dt className="font-semibold text-gray-600">Vendedor:</dt>
                    <dd className="text-gray-800">{data?.employee?.firstName} {data?.employee?.lastName}</dd>
                </div>
                <div className="py-2 border-t border-gray-100">
                    <dt className="font-semibold text-gray-600">Fecha de Venta:</dt>
                    <dd className="text-gray-800">{formatDate(data.createdAt)}</dd>
                </div>
            </dl>
        </div>
    )
}

export { SaleEmployeeInfo };
