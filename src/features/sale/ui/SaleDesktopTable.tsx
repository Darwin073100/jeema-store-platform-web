'use client';
import React from 'react'
import { SaleEntity } from '../domain/entities/sale-entity'
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { FiExternalLink } from 'react-icons/fi';
import { useSaleListBranch } from '../hooks/useSaleList';
import { BasicTable, BCol, BRow, BTableEmpty } from '@/shared/ui/components/tables/BasicTable';
import { useRouter } from 'next/navigation';

interface Props {
    sales: SaleEntity[]
}

const SaleDesktopTable = ({ sales }: Props) => {
    const tableColumns = ['Folio', 'Cliente', 'Empleado', 'Status', 'Total', 'Fecha'];
    const { handleBadgeType } = useSaleListBranch();
    const router = useRouter();
    return (
        <BasicTable theadList={tableColumns} isActions={true}>
            {/* Cuerpo de la tabla */}
            {sales.map(sale => (
                <BRow key={sale.saleId.toString()} >
                    <BCol>{sale.saleId}</BCol>
                    <BCol>{`${sale.customer?.firstName} ${sale.customer?.lastName}`}</BCol>
                    <BCol>{`${sale.employee?.firstName} ${sale.employee?.lastName}`}</BCol>
                    <BCol>
                        <Badge type={handleBadgeType(sale.status)} >
                            {sale.status}
                        </Badge>
                    </BCol>
                    <BCol>{numberMoneyFormat(sale.totalAmount)}</BCol>
                    <BCol>{formatDateShort(sale.updatedAt ?? sale.createdAt)}</BCol>
                    <BCol className="text-right flex justify-end">
                        <Button color='yellow' size='sm' onClick={() => router.push(`/sale/${sale.saleId}`)}>
                            <FiExternalLink size={14} /><span>Detalles</span>
                        </Button>
                    </BCol>
                </BRow>
            ))}
            {(!sales || sales.length === 0) && (
                <BTableEmpty colsNumber={tableColumns.length + 1} />
            )}
        </BasicTable>
    )
}

export { SaleDesktopTable }
