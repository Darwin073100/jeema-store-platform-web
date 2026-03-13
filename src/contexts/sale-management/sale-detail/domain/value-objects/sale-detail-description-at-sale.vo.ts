import { SaleDetailInvalidException } from "../exceptions/sale-detail-invalid.exception";
import { ValueObject } from "src/shared/domain/value-objects/value-object";

interface Prop {
  value: string | null;
}

export class SaleDetailDescriptionAtSaleVO extends ValueObject<Prop> {
  private constructor(props: Prop) {
    super(props);
  }
  
  public static create(value: string | null): SaleDetailDescriptionAtSaleVO {
    if (value && value.trim().length === 0) {
      throw new SaleDetailInvalidException('La descripción del producto al momento de la venta no puede venir vacio.');
    }
    return new SaleDetailDescriptionAtSaleVO({ value });
  }

  get value(){
    return this.props.value;
  }
}
