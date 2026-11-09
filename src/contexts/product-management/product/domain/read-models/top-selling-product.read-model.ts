import { FilterTopEnum } from "../enums/FilterTopEnum";

/**
 * Criterios para el ranking de productos más vendidos de una sucursal.
 * El rango es semiabierto: [dateInit, dateFinish).
 */
export interface TopSellingProductsCriteria {
    readonly dateInit: Date;
    readonly dateFinish: Date;
    /** null = todas las categorías. */
    readonly categoryId: bigint | null;
    readonly orderBy: FilterTopEnum;
    readonly limit: number;
}

/**
 * Fila del ranking: ventas completadas agregadas por producto.
 */
export interface TopSellingProduct {
    readonly productId: bigint;
    readonly name: string;
    readonly categoryName: string | null;
    readonly quantitySales: number;
    readonly totalSales: number;
}
