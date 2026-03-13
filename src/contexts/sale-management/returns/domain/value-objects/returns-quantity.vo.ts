import { ValueObject } from "src/shared/domain/value-objects/value-object";

interface Prop {
  value: number;
}

export class ReturnsQuantityReturnVO extends ValueObject<Prop> {
  private constructor(props: Prop) {
    super(props );
  }
  
  public static create(value: number): ReturnsQuantityReturnVO {
    return new ReturnsQuantityReturnVO({ value });
  }

  get value(){
    return Number(this.props.value);
  }
}
