import { ProductValidateException } from "../exceptions/product-validate.exception";

export class ProductSkuVO {
  constructor(public readonly value: string ) {
    if (value && value.length > 50) {
      throw new ProductValidateException('El SKU debe tener máximo 50 caracteres.');
    }
  }
}
