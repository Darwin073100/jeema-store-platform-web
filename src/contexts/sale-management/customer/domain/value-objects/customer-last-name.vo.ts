import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidCustomerException } from "../exceptions/invalid-customer.exception";

interface Prop{
    value?: string|null;
}
export class CustomerLastNameVO extends ValueObject<Prop> {
  private constructor(prop: Prop) {
    super(prop);
  }

  public static create(value?: string|null): CustomerLastNameVO {
    if(!value) return new CustomerLastNameVO({value})
    if (value.length > 100) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidCustomerException('Los apellidos del cliente no deben ser mayor a 100 caracteres.');
    }
    if (value.length < 3) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidCustomerException('Los apellidos del cliente deben tener como mínimo 3 caracteres.');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new CustomerLastNameVO({ value });
  }

  get value(): string | null | undefined {
    return this.props.value;
  }

}