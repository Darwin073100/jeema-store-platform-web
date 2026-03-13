import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { LotValidateException } from "../exceptions/lot-validate.exception";

interface Prop{
  value: string
}
export class LotNumberVO extends ValueObject<Prop>{
  private constructor(prop: Prop){
    super(prop)
  }

  static create(value: string) {
    if (!value || value.length > 50) {
      throw new LotValidateException('El número de lote es obligatorio y debe tener máximo 50 caracteres.');
    }
    return new LotNumberVO({value});
  }

  get value(){
      return this.props.value;
  }
}
