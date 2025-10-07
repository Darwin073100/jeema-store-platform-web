import React from 'react'
import { SaleEntity } from '../domain/entities/sale-entity'
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { Badge } from '@/ui/components/badges/Badge';
import { Button } from '@/ui/components/buttons';
import { FiExternalLink } from 'react-icons/fi';
import { useSaleListBranch } from '../hooks/useSaleList';

interface Props {
    sales: SaleEntity[]
}

const SaleDesktopTable = ({ sales }: Props) => {
   const { handleBadgeType } = useSaleListBranch();
    return (
        <table className="w-full text-sm text-left text-gray-700">
            {/* Encabezado */}
            <thead className='text-xs text-gray-700 uppercase bg-gray-50/70 font-bold border-b border-gray-300'>
                <tr>
                    <td scope="col" className="px-6 py-3">Folio</td>
                    <td scope="col" className="px-6 py-3">Cliente</td>
                    <td scope="col" className="px-6 py-3">Empleado</td>
                    <td scope="col" className="px-6 py-3">Status</td>
                    <td scope="col" className="px-6 py-3">Total</td>
                    <td scope="col" className="px-6 py-3">Fecha</td>
                    <td scope="col" className="px-6 py-3 text-right">Acciones</td>
                </tr>
            </thead>

            {/* Cuerpo de la tabla */}
            <tbody>
                {sales.map(sale => (<>
                    <tr key={sale.saleId} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 font-medium text-gray-900">{sale.saleId}</td>
                        <td className="px-6 py-4">{`${sale.customer?.firstName} ${sale.customer?.lastName}`}</td>
                        <td className="px-6 py-4">{`${sale.employee?.firstName} ${sale.employee?.lastName}`}</td>
                        <td className="px-6 py-4">
                            <Badge type={handleBadgeType(sale.status)} >
                                {sale.status}
                            </Badge>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">{numberMoneyFormat(sale.totalAmount)}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{formatDateShort(sale.updatedAt ?? sale.createdAt)}</td>
                        <td className="px-6 py-4 text-right flex justify-end">
                            <Button color='yellow' size='sm'>
                                <FiExternalLink size={14} /><span>Detalles</span>
                            </Button>
                        </td>
                    </tr>
                </>))}
            </tbody>
        </table>
    )
}

export { SaleDesktopTable }
