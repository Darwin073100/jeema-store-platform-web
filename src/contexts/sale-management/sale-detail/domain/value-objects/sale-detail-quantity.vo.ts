import { ValueObject } from "src/shared/domain/value-objects/value-object";

interface Prop {
  value: number;
}

export class SaleDetailQuantityVO extends ValueObject<Prop> {
  private constructor(props: Prop) {
    super(props );
    this.validate();
  }

  protected validate(): void {
  }
  
  public static create(value: number): SaleDetailQuantityVO {
    return new SaleDetailQuantityVO({ value });
  }

  get value(){
    return Number(this.props.value);
  }
}
