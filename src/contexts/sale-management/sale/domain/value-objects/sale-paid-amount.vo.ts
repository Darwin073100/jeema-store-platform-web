import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { SaleInvalidException } from "../exceptions/sale-invalid.exception";

interface Prop{
    value: number;
}

export class SalePaidAmountVO extends ValueObject<Prop> {
  private constructor(props: Prop) {
    super(props);
  }

  public static create(value: number): SalePaidAmountVO {
    if (value && value < 0) {
      throw new SaleInvalidException('El monto pagado de la venta no debe ser un número negativo.');
    }
    return new SalePaidAmountVO({ value });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): number {
    return Number(this.props.value);
  }
}
