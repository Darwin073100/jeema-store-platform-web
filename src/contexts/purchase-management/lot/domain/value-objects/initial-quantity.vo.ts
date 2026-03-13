import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { LotValidateException } from "../exceptions/lot-validate.exception";
interface Prop{
  value: number;
}

export class InitialQuantityVO extends ValueObject<Prop> {
  
  private constructor (prop: Prop){
    super(prop);
  }

  static create (value: number) {
    if (value === null || value === undefined || isNaN(value)) {
      throw new LotValidateException('La cantidad inicial es obligatoria.');
    }
    if (value < 0) {
      throw new LotValidateException('La cantidad inicial no puede ser negativa.');
    }
    // Validación de precisión: máximo 18 dígitos, 3 decimales
    const [intPart, decPart] = value.toString().split('.');
    if (intPart.length > 15 || (decPart && decPart.length > 3)) {
      throw new LotValidateException('La cantidad inicial debe tener máximo 18 dígitos en total y 3 decimales.');
    }

    return new InitialQuantityVO({value});
  }

  get value(){
    return Number(this.props.value);
  }
}
