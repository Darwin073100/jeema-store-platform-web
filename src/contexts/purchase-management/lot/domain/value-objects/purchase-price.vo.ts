import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { LotValidateException } from "../exceptions/lot-validate.exception";

interface Prop{
  value: number;
}

export class PurchasePriceVO extends ValueObject<Prop> {
  
  private constructor(prop: Prop) {
    super(prop);
  }
  
  static create(value: number) {
    if (value === null || value === undefined || isNaN(value)) {
      throw new LotValidateException('El precio de compra es obligatorio.');
    }
    if (value < 0) {
      throw new LotValidateException('El precio de compra no puede ser negativo.');
    }
    // Validación de precisión: máximo 12 dígitos, 4 decimales
    const [intPart, decPart] = value.toString().split('.');
    if (intPart.length > 8 || (decPart && decPart.length > 4)) {
      throw new LotValidateException('El precio de compra debe tener máximo 12 dígitos en total y 4 decimales.');
    }

    return new PurchasePriceVO({ value });
  }

  get value(){
    return Number(this.props.value);
  }
}
