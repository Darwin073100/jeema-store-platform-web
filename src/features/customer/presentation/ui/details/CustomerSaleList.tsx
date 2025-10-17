'use client'
import { CustomerEntity } from '@/features/customer/domain/entities/customer.entity'
import { SaleStatusEnum } from '@/features/sale/domain/enums/sale-status.enum'
import { formatDate } from '@/shared/lib/utils/date-formatter'
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter'
import { Badge } from '@/ui/components/badges/Badge'
import { Button } from '@/ui/components/buttons'
import { Spinner } from '@/ui/components/loadings/Spinner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { IoBasketSharp } from 'react-icons/io5'
interface Props {
    data: CustomerEntity
}
const CustomerSaleList = ({ data }: Props) => {
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();
    const handleRedirectToSale = (saleId: bigint)=>{
        setLoading(true);
        router.push(`/sale/${saleId.toString()}`);
    }
    return (
        <div className="space-y-3">
            {(data?.sales?.length ?? 0) > 0 ? (
                data?.sales?.map((sale) => (
                    <div key={sale.saleId} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center hover:bg-gray-100 transition-colors duration-150">

                        {/* Información Principal */}
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-bold text-gray-800">Venta #{sale.saleId}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                <span>{formatDate(sale.createdAt)}</span>
                                <span className="mx-2 text-gray-300">|</span>
                                <Badge type={
                                    sale.status === SaleStatusEnum.COMPLETED
                                        ? 'green' : sale.status === SaleStatusEnum.CANCELLED
                                            ? 'red' : sale.status === SaleStatusEnum.PENDING
                                                ? 'yellow' : 'red'
                                }>
                                    {sale.status}
                                </Badge>
                            </p>
                        </div>

                        {/* Monto y Acción */}
                        <div className="text-right flex items-center space-x-4">
                            <span className="text-xl font-extrabold text-blue-700">
                                {numberMoneyFormat(sale.totalAmount)}
                            </span>
                            <Button size="sm" onClick={()=> handleRedirectToSale(sale.saleId)}>
                                {loading? <Spinner />: <IoBasketSharp />}
                                Detalles
                            </Button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 italic p-4 text-center">Aún no hay ventas registradas para este cliente.</p>
            )}
        </div>
    )
}

export { CustomerSaleList }
