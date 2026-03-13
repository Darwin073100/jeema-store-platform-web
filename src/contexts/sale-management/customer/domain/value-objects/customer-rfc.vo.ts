import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidCustomerException } from "../exceptions/invalid-customer.exception";

interface Prop{
    value?: string | null;
}
export class CustomerRFCVO extends ValueObject<Prop> {
  private constructor(prop: Prop) {
    super(prop);
  }
  public static create(value?: string|null): CustomerRFCVO {
    if(!value) return new CustomerRFCVO({value});
    if (value.length > 13) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidCustomerException('El RFC no debe tener mas de 13 catacteres.');
    }
    if (value.length < 3) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidCustomerException('El RFC no puede tener menos de 3 caracteres');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new CustomerRFCVO({ value:value });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): string|undefined|null {
    return this.props.value;
  }
  
}