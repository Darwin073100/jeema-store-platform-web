export const INVENTORY_CHECKER_PORT = 'INVENTORY_CHECKER_PORT';

export interface InventoryCheckerPort{
    exist(id: bigint):Promise<boolean>
    // Firma para verificar que haya stock disponible
    hasStock(id: bigint, quantity: number): Promise<boolean>;
}