import { ProductValidateException } from "../exceptions/product-validate.exception";

export class ProductDescriptionVO {
  constructor(public readonly value: string | null) {
    if (value && value.length > 10000) {
      throw new ProductValidateException('La descripción del producto debe tener máximo 10000 caracteres.');
    }
  }
}
