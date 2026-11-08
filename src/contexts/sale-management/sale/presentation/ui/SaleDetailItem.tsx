'use client'
import React, { memo } from "react";
import clsx from "clsx";
import { numberBasicFormat } from "@/shared/lib/utils/number-formatter";
import { HiEllipsisVertical } from "react-icons/hi2";
import { Badge } from "@/shared/ui/components/badges/Badge";
import { SaleForEnum } from "../../domain/enums/sale-for.enum";
import { ISaleDetail } from "@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail";
import { ButtonOutLine } from "@/shared/ui/components/buttons/ButtonOutLine";
import { ImageThumbnail } from "@/contexts/image-management/image/presentation/ui";

interface Props {
    saleDetail: ISaleDetail;
    /** Abre el modal del producto (editar cantidad o eliminar). */
    onOpen: (saleDetail: ISaleDetail) => void;
    /** Resalta la fila tras agregarla o modificarla. */
    highlighted?: boolean;
}

/**
 * Fila de un producto en la tabla de la venta (escritorio). El modal se abre con clic derecho, doble
 * clic, `Enter` sobre la fila enfocada (la tecla de menú y `Shift+F10` emiten `contextmenu`) o con ⋮.
 */
const SaleDetailItem = memo(function SaleDetailItem({ saleDetail, onOpen, highlighted = false }: Props) {
    const open = () => onOpen(saleDetail);

    const handleContextMenu = (e: React.MouseEvent<HTMLTableRowElement>) => {
        e.preventDefault();
        open();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
        // Solo cuando el foco está en la fila; el botón ⋮ ya maneja su propio Enter.
        if (e.target !== e.currentTarget || e.key !== 'Enter') return;
        e.preventDefault();
        open();
    };

    return (
        <tr
            data-sale-detail-id={saleDetail.saleDetailId.toString()}
            tabIndex={0}
            aria-haspopup="dialog"
            aria-label={`${saleDetail.productNameAtSale}, cantidad ${saleDetail.quantity}`}
            title="Clic derecho para editar o eliminar"
            onContextMenu={handleContextMenu}
            onDoubleClick={open}
            onKeyDown={handleKeyDown}
            className={clsx(
                "text-sm border-b border-gray-200 text-black cursor-context-menu transition-colors",
                "hover:bg-blue-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600",
                highlighted ? "bg-amber-100 outline-2 -outline-offset-2 outline-amber-400" : "bg-white",
            )}
        >
            <td className="px-2 py-1 bg-blue-200 font-bold">
                {saleDetail.quantity}
            </td>
            <td className="px-1 py-1">
                <ImageThumbnail src={saleDetail.product?.imageUrl ?? null} alt={saleDetail.productNameAtSale} size={32} zoomable />
            </td>
            <th className="px-1 py-1 font-medium text-[12px]">
                {saleDetail.productBarCodeAtSale ?? 'S/C'}
            </th>
            <td className="px-1 py-1 font-bold">
                {saleDetail.productNameAtSale ?? 'S/N'}
            </td>
            <td className="px-2 py-1">
                {saleDetail.productUnitAtSale ?? 'S/P'}
            </td>
            <td className="px-2 py-1">
                <span>$ {numberBasicFormat(saleDetail.regularPriceAtSale ?? 0.00)}</span>
            </td>
            <td className="px-2 py-1 bg-blue-200 font-bold">
                $ {numberBasicFormat((saleDetail.subtotalItem ?? 0.00) + (saleDetail.discountItem ?? 0.00))}
            </td>
            <td className="px-2 py-1">
                <div className="flex justify-between items-center gap-1">
                    <span>$ {numberBasicFormat(saleDetail.unitPriceAtSale ?? 0.00)}</span>
                    <Badge type={saleDetail.saleFor === SaleForEnum.ONE ? 'blue' : saleDetail.saleFor === SaleForEnum.MANY ? 'green' : 'yellow'}>
                        {saleDetail.saleFor ?? 'N/A'}
                    </Badge>
                </div>
            </td>
            <td className="px-2 py-1 bg-green-200">
                $ {numberBasicFormat(saleDetail.discountItem ?? 0.00)}
            </td>
            <td className="px-2 py-1 bg-blue-200 font-bold">
                $ {numberBasicFormat(saleDetail.subtotalItem ?? 0.00)}
            </td>
            <td className="px-1 py-1 text-center">
                <ButtonOutLine
                    type="button"
                    color="gray"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        open();
                    }}
                    onDoubleClick={(e) => e.stopPropagation()}
                    aria-label={`Opciones de ${saleDetail.productNameAtSale}`}
                    aria-haspopup="dialog"
                    title="Editar cantidad o eliminar"
                >
                    <HiEllipsisVertical className="text-lg" />
                </ButtonOutLine>
            </td>
        </tr>
    )
});

export { SaleDetailItem };
