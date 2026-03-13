import { SaleDetailInvalidException } from "../exceptions/sale-detail-invalid.exception";
import { ValueObject } from "src/shared/domain/value-objects/value-object";

interface Prop{
  value: string;
}

export class SaleDetailNameAtSaleVO extends ValueObject<Prop> {
  private constructor(props: Prop) {
    super(props);
  }
  
  public static create(value: string): SaleDetailNameAtSaleVO {
    if (value.trim().length === 0) {
      throw new SaleDetailInvalidException('El nombre del producto al momento de la venta no puede venir vacio.');
    }
    return new SaleDetailNameAtSaleVO({ value });
  }

  get value(){
    return this.props.value;
  }
}
