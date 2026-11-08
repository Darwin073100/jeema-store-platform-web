import { ISaleDetail } from "@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail";
import { ISale } from "../interfaces/ISale";

/**
 * Busca en la venta el detalle de un código de barras. El servidor usa esa misma clave para decidir si
 * actualiza un detalle existente o crea uno nuevo, así que sirve para saber qué fila acaba de cambiar.
 */
export const findDetailByBarCode = (sale: ISale | null | undefined, barCode: string): ISaleDetail | null => {
    return sale?.saleDetails?.find(detail => detail.productBarCodeAtSale === barCode) ?? null;
};

/**
 * Producto que abre el atajo F8: el último agregado o modificado en esta sesión (`lastTouchedDetailId`).
 * Si no hay uno, o ya se eliminó (por ejemplo, tras recargar la página), el de mayor `saleDetailId`, que es
 * el último en llegar a la venta. Devuelve null si la venta no tiene productos.
 */
export const findLastAddedDetail = (
    saleDetails: ISaleDetail[] | null | undefined,
    lastTouchedDetailId: bigint | null | undefined,
): ISaleDetail | null => {
    const details = saleDetails ?? [];
    if (details.length === 0) return null;
    const touched = lastTouchedDetailId !== null && lastTouchedDetailId !== undefined
        ? details.find(detail => detail.saleDetailId === lastTouchedDetailId)
        : undefined;
    return touched ?? details.reduce((last, detail) => detail.saleDetailId > last.saleDetailId ? detail : last);
};
