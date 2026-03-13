export class ProductAlreadyExistsException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductAlreadyExistsException';
  }

  static forSku(establishmentId: bigint, sku: string) {
    return new ProductAlreadyExistsException(
      `Ya existe un producto con el SKU '${sku}' para el establecimiento '${establishmentId}'.`
    );
  }

  static forUniversalBarCode(establishmentId: bigint, barCode: string) {
    return new ProductAlreadyExistsException(
      `Ya existe un producto con el código de barras universal '${barCode}' para el establecimiento '${establishmentId}'.`
    );
  }
}
