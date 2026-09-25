'use client';
import React from 'react'
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { FiExternalLink } from 'react-icons/fi';
import { IoPrintSharp } from 'react-icons/io5';
import { useSaleListBranch } from '../hooks/useSaleList';
import { BCol, BRow, BTableEmpty } from '@/shared/ui/components/tables/BasicTable';
import { useRouter } from 'next/navigation';
import { PrimaryTable } from '@/shared/ui/components/tables/PrimaryTable';
import { useSaleStore } from '../stores/sale.store';
import { useSaleUIStore } from '../stores/sale.ui.store';
import { canReprintSaleTicket } from '../utils/sale-status-badge';


const SaleDesktopTable = () => {
    const tableColumns = ['Folio', 'Cliente', 'Empleado', 'Status', 'Total', 'Fecha'];
    const { handleBadgeType } = useSaleListBranch();
    const { sales } = useSaleStore();
    const { setReprintTargetSaleId, openSaleModal } = useSaleUIStore();
    const router = useRouter();
    return (
        <PrimaryTable theadList={tableColumns} isActions={true}>
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
                    <BCol className="text-right flex justify-end gap-2">
                        {canReprintSaleTicket(sale.status) &&
                            <Button size='sm' color='gray' onClick={() => { setReprintTargetSaleId(sale.saleId); openSaleModal('saleTicketReprintModal'); }}>
                                <IoPrintSharp size={14} />
                            </Button>
                        }
                        <Button size='sm' onClick={() => router.push(`/sale/${sale.saleId}`)}>
                            <FiExternalLink size={14} /><span>Detalles</span>
                        </Button>
                    </BCol>
                </BRow>
            ))}
            {(!sales || sales.length === 0) && (
                <BTableEmpty colsNumber={tableColumns.length + 1} />
            )}
        </PrimaryTable>
    )
}

export { SaleDesktopTable }
