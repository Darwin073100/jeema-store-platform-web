import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidCustomerException } from "../exceptions/invalid-customer.exception";

interface Prop{
    value?: string|null;
}
export class CustomerPhoneNumberVO extends ValueObject<Prop> {
  private constructor(prop: Prop) {
    super(prop);
  }
  public static create(value?: string|null): CustomerPhoneNumberVO {
      if(value===null || value===undefined){
        return new CustomerPhoneNumberVO({ value:null });
      }

    if (value.length > 25) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidCustomerException('El número de teléfono no debe ser mayor a 25 caracteres.');
    }
    if (value.length < 3) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidCustomerException('El número de teléfono debe tener como mínimo 3 caracteres.');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new CustomerPhoneNumberVO({ value:value });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): string|null|undefined {
    return this.props.value;
  }
}