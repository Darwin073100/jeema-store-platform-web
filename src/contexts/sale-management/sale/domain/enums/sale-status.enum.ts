export enum SaleStatusEnum {
    INITIALIZED = 'inicializada', // Venta inicializada
    PENDING = 'pendiente',    // Venta iniciada pero no completada
    COMPLETED = 'completada', // Venta finalizada con éxito
    CANCELLED = 'cancelada',  // Venta cancelada
    REFUNDED = 'reembolsada'  // Venta con reembolso
}
