import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidSuplierException } from "../exceptions/invalid-suplier.exception";

interface Prop{
    value: string | null;
}

/**
 * Name es un Value Object que encapsula la lógica y las reglas de negocio
 * para el nombre de un centro educativo (o cualquier otra entidad que lo requiera).
 *
 * Es inmutable, es decir, su valor no cambia una vez creado.
 * Se define por sus atributos y no tiene una identidad única.
 */
export class SuplierPhoneNumberVO extends ValueObject<Prop> {
  // Aseguramos que el constructor sea privado para forzar el uso de métodos de fábrica
  // o para que solo ValueObject pueda crearlo si se gestiona internamente.
  private constructor(prop: Prop) {
    super(prop);
  }

  /**
   * Crea una nueva instancia del Value Object Name.
   * Realiza validaciones para asegurar que el nombre sea válido.
   *
   * @param phoneNumber El valor del nombre a encapsular.
   * @returns Una nueva instancia de Name.
   * @throws Error si el nombre es inválido (ej. vacío, muy largo).
   */
  public static create(phoneNumber: string | null): SuplierPhoneNumberVO {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      return new SuplierPhoneNumberVO({ value:phoneNumber });
    }
    if (phoneNumber.length > 25) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidSuplierException('El número de teléfono no debe ser mayor a 25 caracteres.');
    }
    if (phoneNumber.length < 3) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidSuplierException('El número de teléfono debe tener como mínimo 3 caracteres.');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new SuplierPhoneNumberVO({ value:phoneNumber });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): string | null {
    return this.props.value;
  }
}