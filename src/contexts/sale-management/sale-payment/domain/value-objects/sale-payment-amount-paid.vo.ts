import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { SalePaymentInvalidException } from "../exceptions/sale-payment-invalid.exception";

interface Prop {
    value: number;
}

export class SalePaymentAmountPaidVO extends ValueObject<Prop> {
    private constructor(prop: Prop){
        super(prop);
    }

    public static create(value: number): SalePaymentAmountPaidVO {
        if (value && value < 0) {
          throw new SalePaymentInvalidException('El monto pagado de la venta no puede ser negativo.');
        }
        // Podrías añadir más validaciones: caracteres especiales, formato, etc.
    
        return new SalePaymentAmountPaidVO({ value });
      }
    
      /**
       * Getter para el valor del nombre.
       */
      get value(): number {
        return this.props.value;
      }
}