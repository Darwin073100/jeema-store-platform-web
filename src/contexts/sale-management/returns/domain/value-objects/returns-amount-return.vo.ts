import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { ReturnsInvalidException } from "../exceptions/returns-invalid.exception";

interface Prop {
  value: number;
}

export class ReturnsAmountReturnVO extends ValueObject<Prop> {
  private constructor(props: Prop) {
    super(props);
  }
  
  public static create(value: number): ReturnsAmountReturnVO {
    if (value < 0) {
      throw new ReturnsInvalidException('El monto a devolver no puede ser negativo.');
    }
    return new ReturnsAmountReturnVO({ value });
  }

  get value(){
    return Number(this.props.value);
  }
}
