import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidCustomerException } from "../exceptions/invalid-customer.exception";

interface Prop{
    value: string;
}
export class CustomerFirstNameVO extends ValueObject<Prop> {
  private constructor(prop: Prop) {
    super(prop);
  }

  /**
   * Crea una nueva instancia del Value Object Name.
   * Realiza validaciones para asegurar que el nombre sea válido.
   *
   * @param name El valor del nombre a encapsular.
   * @returns Una nueva instancia de Name.
   * @throws Error si el nombre es inválido (ej. vacío, muy largo).
   */
  public static create(name: string): CustomerFirstNameVO {
    if (!name || name.trim().length === 0) {
      throw new InvalidCustomerException('El nombre no puede estar vacío.'); // Un error de dominio apropiado
    }
    if (name.length > 100) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidCustomerException('El nombre del cliente no debe ser mayor a 100 caracteres.');
    }
    if (name.length < 3) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidCustomerException('El nombre del cliente debe tener como mínimo 3 caracteres.');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new CustomerFirstNameVO({ value:name });
  }

  get value(): string {
    return this.props.value;
  }

}