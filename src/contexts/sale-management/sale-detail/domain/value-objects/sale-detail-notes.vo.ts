import { SaleDetailInvalidException } from "../exceptions/sale-detail-invalid.exception";
import { ValueObject } from "src/shared/domain/value-objects/value-object";

interface Prop {
  value: string | null;
}

export class SaleDetailNotesVO extends ValueObject<Prop> {
  private constructor(props: Prop) {
    super(props);
  }

  public static create(value: string | null): SaleDetailNotesVO {
    if ( value ) {
      if(value.trim().length < 1) {
        throw new SaleDetailInvalidException('Las notas del producto al momento de la venta deben tener al menos 1 caracter.');
      }
    }
    return new SaleDetailNotesVO({ value });
  }
  get value(){
    return this.props.value;
  }
}
