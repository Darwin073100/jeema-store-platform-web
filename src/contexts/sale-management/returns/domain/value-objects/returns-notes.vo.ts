import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { ReturnsInvalidException } from "../exceptions/returns-invalid.exception";

interface Prop {
  value: string | null;
}

export class ReturnsNotesVO extends ValueObject<Prop> {
  private constructor(props: Prop) {
    super(props);
  }

  public static create(value: string | null): ReturnsNotesVO {
    if ( value ) {
      if(value.trim().length < 3) {
        throw new ReturnsInvalidException('Las notas del producto al momento de la devolución deben tener al menos 3 caracteres.');
      }
    }
    return new ReturnsNotesVO({ value });
  }
  get value(){
    return this.props.value;
  }
}
