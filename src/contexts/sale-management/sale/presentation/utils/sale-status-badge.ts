import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";

export type SaleStatusBadgeColor = 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' | 'orange';

export interface SaleStatusBadge {
    label: string;
    color: SaleStatusBadgeColor;
}

/**
 * Fuente única de verdad para el mapeo status -> {label, color} de una venta.
 * Antes estaba triplicado (y en algún caso sin `default`) entre HeaderDetail.tsx,
 * useSaleList.ts y CustomerSaleList.tsx — ver spect/10_venta_a_credito_spect.md.
 */
const SALE_STATUS_BADGE_MAP: Record<SaleStatusEnum, SaleStatusBadge> = {
    [SaleStatusEnum.INITIALIZED]: { label: 'Inicializada', color: 'gray' },
    [SaleStatusEnum.PENDING]: { label: 'Pendiente', color: 'blue' },
    [SaleStatusEnum.COMPLETED]: { label: 'Completada', color: 'green' },
    [SaleStatusEnum.CANCELLED]: { label: 'Cancelada', color: 'red' },
    [SaleStatusEnum.REFUNDED]: { label: 'Reembolsada', color: 'purple' },
    [SaleStatusEnum.CREDIT]: { label: 'Crédito', color: 'orange' },
};

const DEFAULT_BADGE: SaleStatusBadge = { label: 'Desconocido', color: 'gray' };

export function getSaleStatusBadge(status: SaleStatusEnum): SaleStatusBadge {
    return SALE_STATUS_BADGE_MAP[status] ?? DEFAULT_BADGE;
}
