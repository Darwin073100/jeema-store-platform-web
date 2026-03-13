import { SaleDetailInvalidException } from "../exceptions/sale-detail-invalid.exception";
import { ValueObject } from "src/shared/domain/value-objects/value-object";

interface Prop {
  value: number;
}

export class SaleDetailSubTotalVO extends ValueObject<Prop> {
  private constructor(props: Prop) {
    super(props);
  }
  
  public static create(value: number): SaleDetailSubTotalVO {
    if (value < 0) {
      throw new SaleDetailInvalidException('El subtotal no puede ser negativo');
    }
    return new SaleDetailSubTotalVO({ value });
  }

  get value(){
    return Number(this.props.value);
  }
}
