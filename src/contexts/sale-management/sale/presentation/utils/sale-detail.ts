import { ISaleDetail } from "@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail";
import { ISale } from "../interfaces/ISale";

/**
 * Busca en la venta el detalle de un código de barras. El servidor usa esa misma clave para decidir si
 * actualiza un detalle existente o crea uno nuevo, así que sirve para saber qué fila acaba de cambiar.
 */
export const findDetailByBarCode = (sale: ISale | null | undefined, barCode: string): ISaleDetail | null => {
    return sale?.saleDetails?.find(detail => detail.productBarCodeAtSale === barCode) ?? null;
};
