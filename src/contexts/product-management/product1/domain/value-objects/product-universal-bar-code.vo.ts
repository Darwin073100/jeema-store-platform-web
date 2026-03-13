import { ProductValidateException } from "../exceptions/product-validate.exception";

export class ProductUniversalBarCodeVO {
  constructor(public readonly value: string | null) {
    if (value && value.length > 100) {
      throw new ProductValidateException('El código de barras universal debe tener máximo 100 caracteres.');
    }
  }
}
