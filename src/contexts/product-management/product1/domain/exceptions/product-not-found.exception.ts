/**
 * Excepción lanzada cuando no se encuentra un producto
 */
export class ProductNotFoundException extends Error {
  constructor(id: bigint) {
    super(`Producto con ID ${id} no encontrado`);
    this.name = 'ProductNotFoundException';
  }
}
