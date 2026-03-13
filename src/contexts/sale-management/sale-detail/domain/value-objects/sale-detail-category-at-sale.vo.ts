import { SaleDetailInvalidException } from "../exceptions/sale-detail-invalid.exception";
import { ValueObject } from "src/shared/domain/value-objects/value-object";

interface Prop {
  value: string | null;
}

export class SaleDetailCategoryAtSaleVO extends ValueObject<Prop> {
  private constructor(props: Prop) {
    super(props);
  }
  
  public static create(value: string | null): SaleDetailCategoryAtSaleVO {
    if (value && value.trim().length === 0) {
      throw new SaleDetailInvalidException('La categoría del producto al momento de la venta no puede venir vacio.');
    }
    return new SaleDetailCategoryAtSaleVO({ value });
  }

  get value(){
    return this.props.value;
  }
}
