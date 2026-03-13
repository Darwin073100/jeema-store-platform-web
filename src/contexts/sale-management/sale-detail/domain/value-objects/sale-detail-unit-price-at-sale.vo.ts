import { ValueObject } from "src/shared/domain/value-objects/value-object";

interface Prop {
  value: number;
}

export class SaleDetailUnitPriceAtSaleVO extends ValueObject<Prop> {
  private constructor(props: Prop) {
    super(props);
  }
  
  public static create(value: number): SaleDetailUnitPriceAtSaleVO {
    return new SaleDetailUnitPriceAtSaleVO({ value });
  }
  get value(){
    return Number(this.props.value);
  }
}
