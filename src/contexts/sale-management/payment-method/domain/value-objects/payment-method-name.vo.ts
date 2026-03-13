import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { PaymentMethodInvalidException } from "../exceptions/payment-method-invalid.exception";

interface PaymentMethodNameProps {
    value: string;
}

export class PaymentMethodNameVO extends ValueObject<PaymentMethodNameProps>{
    private constructor(props: PaymentMethodNameProps){
        super(props)
    }

  /**
   * Crea una nueva instancia del Value Object PaymentMethodName.
   * Realiza validaciones para asegurar que el nombre sea válido.
   *
   * @param name El valor del nombre a encapsular.
   * @returns Una nueva instancia de Name.
   * @throws Error si el nombre es inválido (ej. vacío, muy largo).
   */
  public static create(name: string): PaymentMethodNameVO{
    // ...removed console.log...
    if(!name || name.length === 0){
        throw new PaymentMethodInvalidException('El nombre del método de págo no puede ir vacio.'); 
    }
    if(name.length > 50){
        throw new PaymentMethodInvalidException('El nombre del método de págo no puede ser mayor a 50 catacteres.');
    }
    if(name.length < 3){
        throw new PaymentMethodInvalidException('El nombre del método de págo debe tener al menos 3 caracteres.');
    }

    return new PaymentMethodNameVO({value: name });
  }

  /**
   * Getter para ver el valor del nombre del método de págo.
   */
  get name(): string{
    return this.props.value;
  }
}