'use client'
import React, { useState } from 'react'
import { Button } from '@/shared/ui/components/buttons';
import { SaleEntity } from '../domain/entities/sale-entity';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { useSaleListBranch } from '../hooks/useSaleList';
import { formatDate } from '@/shared/lib/utils/date-formatter';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { useRouter } from 'next/navigation';
import { FiExternalLink } from 'react-icons/fi';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';

interface Props {
    sales: SaleEntity[]
}

const SaleCardList = ({ sales }: Props) => {
    const router = useRouter();
    const [saleId, setSaleId] = useState(BigInt(0));
    const { handleBadgeType } = useSaleListBranch();
    const handleRouter = (id: bigint)=> {
        setSaleId(id);
        router.push(`/sale/${id.toString()}`);
    }
    return (<>
        {sales.map(sale => (
            <div className="bg-white p-4 mb-3 border border-gray-200 rounded-lg shadow-sm">
                {/* Cabecera de la Tarjeta (Folio y Status) */}
                <div className="flex justify-between items-start pb-2 border-b border-gray-100 mb-2">
                    <p className="text-lg font-bold text-gray-900">
                        Folio: <span className="text-blue-600">#{sale.saleId}</span>
                    </p>
                    <Badge type={handleBadgeType(sale.status)}>
                        {sale.status}
                    </Badge>
                </div>

                {/* Contenido Principal (Cliente, Empleado, Cantidad) */}
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="col-span-2">
                        <p className="text-gray-500 font-bold">Cliente:</p>
                        <p className="text-gray-700">{`${sale.customer?.firstName} ${sale.customer?.lastName}`}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 font-bold">Empleado:</p>
                        <p className="text-gray-700">{`${sale.employee?.firstName} ${sale.employee?.lastName}`}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 font-medium">Fecha:</p>
                        <p className="text-gray-700 font-semibold">{formatDate(sale.updatedAt ?? sale.createdAt)}</p>
                    </div>
                </div>

                {/* Totales (Footer) */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">Total: <span className="text-lg font-extrabold text-gray-900 ml-1">{numberMoneyFormat(sale.totalAmount)}</span></p>
                    <p className="text-xs text-gray-500 mt-1">
                        Efectivo: <span className="font-medium text-green-700">{'$--'}</span> | Transf.: <span className="font-medium text-blue-700">{'$--'}</span>
                    </p>
                </div>

                {/* Botón de Acción (Detalles, usando tu color de acento Naranja) */}
                <Button className='w-full mt-3' onClick={()=> handleRouter(sale.saleId)}>
                    {saleId===sale.saleId? <Spinner size={14}/>: <FiExternalLink />} Ver Detalles
                </Button>
            </div>
        ))}
    </>);
}

export { SaleCardList };
