'use client'
import React, { memo } from 'react'
import clsx from 'clsx';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { HiEllipsisVertical } from 'react-icons/hi2';
import { SaleForEnum } from '../../domain/enums/sale-for.enum';
import { ButtonOutLine } from '@/shared/ui/components/buttons/ButtonOutLine';
import { ISaleDetail } from '@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail';
import { ImageThumbnail } from '@/contexts/image-management/image/presentation/ui';

interface Props {
    saleDetail: ISaleDetail;
    /** Abre el modal del producto (editar cantidad o eliminar). */
    onOpen: (saleDetail: ISaleDetail) => void;
    /** Resalta la tarjeta tras agregarla o modificarla. */
    highlighted?: boolean;
}

/**
 * Tarjeta de un producto en la venta (móvil y tablet). En táctil no hay clic derecho y iOS no emite
 * `contextmenu` con pulsación larga, así que tocar la tarjeta abre el modal. El acceso por teclado es ⋮.
 */
const SaleDetailItemMovile = memo(function SaleDetailItemMovile({ saleDetail, onOpen, highlighted = false }: Props) {
    const open = () => onOpen(saleDetail);

    return (
        <div
            data-sale-detail-id={saleDetail.saleDetailId.toString()}
            onClick={open}
            onContextMenu={(e) => {
                e.preventDefault();
                open();
            }}
            className={clsx(
                "p-4 rounded-2xl w-full text-gray-700 cursor-pointer transition-colors",
                highlighted ? "bg-amber-100 outline-2 outline-amber-400" : "bg-white",
            )}
        >
            <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2 items-center min-w-0">
                    <ImageThumbnail src={saleDetail.product?.imageUrl ?? null} alt={saleDetail.productNameAtSale} size={36} zoomable />
                    <Badge type="green">{saleDetail.quantity}</Badge>
                    <div className="min-w-0 wrap-break-word">{saleDetail.productNameAtSale}</div>
                </div>
                <ButtonOutLine
                    type="button"
                    color="gray"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        open();
                    }}
                    aria-label={`Opciones de ${saleDetail.productNameAtSale}`}
                    aria-haspopup="dialog"
                    title="Editar cantidad o eliminar"
                    className="shrink-0"
                >
                    <HiEllipsisVertical className="text-xl" />
                </ButtonOutLine>
            </div>
            <div className="flex gap-2">
                <div className="flex gap-1"><Badge type="gray">{saleDetail.productBarCodeAtSale}</Badge></div>
                <Badge type={saleDetail.saleFor === SaleForEnum.ONE ? 'blue' : saleDetail.saleFor === SaleForEnum.MANY ? 'green' : 'yellow'}>
                    {saleDetail.saleFor ?? 'N/A'}
                </Badge>
                <Badge>{saleDetail.productUnitAtSale}</Badge>
            </div>
            <div className="flex flex-col items-end">
                <div className="flex gap-2 justify-end">
                    <Badge type="green">-{numberMoneyFormat((saleDetail.discountItem ?? 0.00))}</Badge>
                    <span>{numberMoneyFormat((saleDetail.subtotalItem ?? 0.00) + (saleDetail.discountItem ?? 0.00))}</span>
                </div>
                <span className="text-2xl">{numberMoneyFormat((saleDetail.subtotalItem ?? 0.00))}</span>
            </div>
        </div>
    )
});

export { SaleDetailItemMovile };
