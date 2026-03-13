import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidCustomerException } from "../exceptions/invalid-customer.exception";

interface Prop{
    value?: string|null;
}
export class CustomerEmailVO extends ValueObject<Prop> {
  // Aseguramos que el constructor sea privado para forzar el uso de métodos de fábrica
  // o para que solo ValueObject pueda crearlo si se gestiona internamente.
  private constructor(prop: Prop) {
    super(prop);
  }
  public static create(value?: string|null): CustomerEmailVO {
    if(!value) return new CustomerEmailVO({value});
    if (value.length > 100) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidCustomerException('El correo electrónico no debe ser mayor a 100 caracteres.');
    }
    if (value.length < 3) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidCustomerException('El correo electónico debe tener como mínimo 3 caracteres.');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new CustomerEmailVO({ value:value });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): string|undefined|null {
    return this.props.value;
  }
}