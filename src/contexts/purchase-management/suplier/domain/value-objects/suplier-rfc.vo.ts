import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidSuplierException } from "../exceptions/invalid-suplier.exception";

interface Prop{
    value: string | null;
}

/**
 * SuplierRFCVO es un Value Object que encapsula la lógica y las reglas de negocio
 * para el nombre de un centro educativo (o cualquier otra entidad que lo requiera).
 *
 * Es inmutable, es decir, su valor no cambia una vez creado.
 * Se define por sus atributos y no tiene una identidad única.
 */
export class SuplierRFCVO extends ValueObject<Prop> {
  // Aseguramos que el constructor sea privado para forzar el uso de métodos de fábrica
  // o para que solo ValueObject pueda crearlo si se gestiona internamente.
  private constructor(prop: Prop) {
    super(prop);
  }

  /**
   * Crea una nueva instancia del Value Object Name.
   * Realiza validaciones para asegurar que el nombre sea válido.
   *
   * @param rfc El valor del rfc a encapsular.
   * @returns Una nueva instancia de rfc.
   * @throws Error si el nombre es inválido (ej. vacío, muy largo).
   */
  public static create(rfc: string | null): SuplierRFCVO {
    if(!rfc) return new SuplierRFCVO({value: null});

    if (rfc.length > 13) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidSuplierException('El RFC no debe tener mas de 13 catacteres.');
    }
    if (rfc.length < 3) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidSuplierException('El RFC no puede tener menos de 3 caracteres');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new SuplierRFCVO({ value:rfc });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): string | null {
    return this.props.value;
  }
  
}