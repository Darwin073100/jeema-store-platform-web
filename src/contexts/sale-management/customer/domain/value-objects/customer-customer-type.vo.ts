import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidCustomerException } from "../exceptions/invalid-customer.exception";

interface Prop{
    value?: string | null;
}

/**
 * Name es un Value Object que encapsula la lógica y las reglas de negocio
 * para el nombre de un centro educativo (o cualquier otra entidad que lo requiera).
 *
 * Es inmutable, es decir, su valor no cambia una vez creado.
 * Se define por sus atributos y no tiene una identidad única.
 */
export class CustomerTypeVO extends ValueObject<Prop> {
  private constructor(prop: Prop) {
    super(prop);
  }

  public static create(value?: string|null): CustomerTypeVO {
    if(!value) return new CustomerTypeVO({value: value});

    if (value.length > 50) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidCustomerException('El typo de cliente no debe ser mayor a 50 caracteres.');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new CustomerTypeVO({ value:value });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): string|null|undefined {
    return this.props.value;
  }
}