import { ProductValidateException } from "../exceptions/product-validate.exception";

export class ProductNameVO {
  constructor(public readonly value: string) {
    if (!value || value.length > 150) {
      throw new ProductValidateException('El nombre del producto es obligatorio y debe tener máximo 150 caracteres.');
    }
  }
}
