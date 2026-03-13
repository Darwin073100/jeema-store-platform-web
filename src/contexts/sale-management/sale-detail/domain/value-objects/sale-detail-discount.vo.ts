import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { SaleDetailInvalidException } from "../exceptions/sale-detail-invalid.exception";

interface Prop {
  value: number;
}

export class SaleDetailDiscountVO extends ValueObject<Prop> {
  private constructor(props: Prop) {
    super(props);
  }

  
  public static create(value: number): SaleDetailDiscountVO {
    if (value < 0) {
      throw new SaleDetailInvalidException('El descuento no puede ser negativo');
    }
    return new SaleDetailDiscountVO({ value });
  }
  get value(){
    return Number(this.props.value);
  }
}
