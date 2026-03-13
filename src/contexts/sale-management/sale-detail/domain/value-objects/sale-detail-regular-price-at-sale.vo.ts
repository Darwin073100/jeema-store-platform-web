import { ValueObject } from "src/shared/domain/value-objects/value-object";

interface Prop {
  value: number;
}

export class SaleDetailRegularPriceAtSaleVO extends ValueObject<Prop> {
  private constructor(props: Prop) {
    super(props);
  }
  
  public static create(value: number): SaleDetailRegularPriceAtSaleVO {
    return new SaleDetailRegularPriceAtSaleVO({ value });
  }

  get value(){
    return Number(this.props.value);
  }
}
