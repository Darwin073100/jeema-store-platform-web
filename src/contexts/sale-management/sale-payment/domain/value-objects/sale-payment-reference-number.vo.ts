import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { SalePaymentInvalidException } from "../exceptions/sale-payment-invalid.exception";

interface Prop {
    value?: string | null;
}

export class SalePaymentReferenceNumberVO extends ValueObject<Prop> {
    private constructor(prop: Prop){
        super(prop);
    }

    public static create(value?: string | null): SalePaymentReferenceNumberVO {
        if (value && value.trim().length > 100) {
          throw new SalePaymentInvalidException('El número de referencia de pago no puede tener más de 100 caracteres.');
        }
        // Podrías añadir más validaciones: caracteres especiales, formato, etc.
    
        return new SalePaymentReferenceNumberVO({ value });
      }
    
      /**
       * Getter para el valor del nombre.
       */
      get value(): string | null | undefined {
        return this.props.value;
      }
}