export class StockNotAvailableException extends Error {
  constructor(
    public readonly inventoryId: bigint,
    public readonly quantityRequested: number,
    public readonly locationAvailable?: string,
    public readonly quantityAvailable?: number
  ) {
    const message = locationAvailable 
      ? `No hay stock suficiente en Ventas para el inventario ${inventoryId}. Se requieren ${quantityRequested} unidades. Hay ${quantityAvailable} unidades disponibles en ${locationAvailable}.`
      : `No hay stock suficiente para el inventario ${inventoryId}. Se requieren ${quantityRequested} unidades.`;
    super(message);
    this.name = 'StockNotAvailableException';
  }
}
