/**
 * Enum para determinar en donde se encuentra el proucto
 * - SALE = venta
 * - STOCK = almacen
 * - DAMAGED = dañado
 * - TRAVELING = viajando
 */
export enum LocationEnum{
    SALE = 'venta', // Producto disponible en el área de venta
    STOCK= 'almacen', // Producto en el almacén/bodega
    DAMAGED= 'dañado', // Producto dañado, no apto para venta
    TRAVELING= 'viajando' // Producto moviéndose entre sucursales/ubicaciones
}