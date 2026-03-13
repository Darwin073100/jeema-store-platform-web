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
export class SuplierEmailVO extends ValueObject<Prop> {
  // Aseguramos que el constructor sea privado para forzar el uso de métodos de fábrica
  // o para que solo ValueObject pueda crearlo si se gestiona internamente.
  private constructor(prop: Prop) {
    super(prop);
  }

  /**
   * Crea una nueva instancia del Value Object Name.
   * Realiza validaciones para asegurar que el nombre sea válido.
   *
   * @param email El valor del correo a encapsular.
   * @returns Una nueva instancia de Email.
   * @throws Error si el nombre es inválido (ej. vacío, muy largo).
   */
  public static create(email: string | null): SuplierEmailVO {
    if(!email) return new SuplierEmailVO({value: null});

    if (email.length > 100) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidSuplierException('El correo electrónico no debe ser mayor a 100 caracteres.');
    }
    if (email.length < 3) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidSuplierException('El correo electónico debe tener como mínimo 3 caracteres.');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new SuplierEmailVO({ value:email });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): string | null {
    return this.props.value;
  }
}