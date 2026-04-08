'use client'
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { RoundedButton } from '@/shared/ui/components/buttons/RoundedButton';
import React from 'react'
import { BiTrash } from 'react-icons/bi';
import { SaleForEnum } from '../../domain/enums/sale-for.enum';
import { HiPencilSquare } from 'react-icons/hi2';
import { Button } from '@/shared/ui/components/buttons';
import { useDeleteDetail } from '../hooks/useDeleteDetail';
import { useUpdateDetailModal } from '../hooks/useUpdateDetailModal';
import { ISaleDetail } from '@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail';
interface Props {
    saleDetail: ISaleDetail
}
const SaleDetailItemMovile = ({saleDetail}:Props) => {
        const { handleOpenModalDeleteDetail } = useDeleteDetail();
        const { handleLoadUpdateDetail } = useUpdateDetailModal();
    return (
        <div className="bg-white p-4 rounded-2xl w-full text-gray-700">
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <Badge type="green">{saleDetail.quantity}</Badge>
                    <div>{saleDetail.productNameAtSale}</div>
                </div>
                <div>
                    <RoundedButton color="red" onClick={() => handleOpenModalDeleteDetail(saleDetail)}>
                        <BiTrash />
                    </RoundedButton>
                </div>
            </div>
            <div className="flex gap-2">
                <div className="flex gap-1"><Badge type="gray">{saleDetail.productBarCodeAtSale}</Badge></div>
                <Badge type={saleDetail?.saleFor === SaleForEnum.ONE ? 'blue' : saleDetail?.saleFor === SaleForEnum.MANY ? 'green' : 'yellow'}>
                    {saleDetail?.saleFor ?? 'N/A'}
                </Badge>
                <Badge>{saleDetail.productUnitAtSale}</Badge>
            </div>
            <div>
                <div className="flex flex-col justify-end saleDetails-end">
                    <div className="flex gap-2 justify-end">
                        <Badge type="green">-{numberMoneyFormat((saleDetail?.discountItem ?? 0.00))}</Badge>
                        <span className="">{numberMoneyFormat((saleDetail?.subtotalItem ?? 0.00) + (saleDetail?.discountItem ?? 0.00))}</span>
                    </div>
                    <div className="w-full flex gap-2 justify-between">
                        <Button size="sm" onClick={() => handleLoadUpdateDetail(saleDetail)} color="yellow" title="Modifica cantidades y unidades de productos en la venta.">
                            <HiPencilSquare /> Editar cantidad
                        </Button>
                        <span className="text-2xl">{numberMoneyFormat((saleDetail?.subtotalItem ?? 0.00))}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { SaleDetailItemMovile };
