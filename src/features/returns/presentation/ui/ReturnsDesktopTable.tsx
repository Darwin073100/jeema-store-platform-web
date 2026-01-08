'use client';
import React from 'react'
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { Button } from '@/shared/ui/components/buttons';
import { FiExternalLink } from 'react-icons/fi';
import { BCol, BRow, BTableEmpty } from '@/shared/ui/components/tables/BasicTable';
import { useRouter } from 'next/navigation';
import { PrimaryTable } from '@/shared/ui/components/tables/PrimaryTable';
import { ReturnsEntity } from '../../domain/entities/returns.entity';

interface Props {
    returns: ReturnsEntity[]
}

const ReturnsDesktopTable = ({ returns }: Props) => {
    const tableColumns = ['Folio', 'Producto', 'P. Unitario', 'Unidades', 'Monto', 'Empleado', 'Fecha'];
    const router = useRouter();
    return (
        <PrimaryTable theadList={tableColumns} isActions={true}>
            {/* Cuerpo de la tabla */}
            {returns.map(item => (
                <BRow key={item.returnsId.toString()} >
                    <BCol>{item.returnsId}</BCol>
                    <BCol>{item.saleDetail?.productNameAtSale}</BCol>
                    <BCol>{numberMoneyFormat(item.saleDetail?.unitPriceAtSale ?? 0)}</BCol>
                    <BCol>{item.quantityReturn}</BCol>
                    <BCol>{numberMoneyFormat(item.amountReturn)}</BCol>
                    <BCol>{`${item.employee?.firstName} ${item.employee?.lastName}`}</BCol>
                    <BCol>{formatDateShort(item.updatedAt ?? item.createdAt)}</BCol>
                    <BCol className="text-right flex justify-end">
                        <Button color='yellow' size='sm' onClick={() => router.push(`/sale/${item?.saleDetail?.saleId}`)}>
                            <FiExternalLink size={14} /><span>Detalles</span>
                        </Button>
                    </BCol>
                </BRow>
            ))}
            {(!returns || returns.length === 0) && (
                <BTableEmpty colsNumber={tableColumns.length + 1} />
            )}
        </PrimaryTable>
    )
}

export { ReturnsDesktopTable }
