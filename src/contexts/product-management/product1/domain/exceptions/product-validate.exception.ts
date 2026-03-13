/**
 * Excepción lanzada cuando la validación de un producto falla
 */
export class ProductValidateException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductValidateException';
  }
}
