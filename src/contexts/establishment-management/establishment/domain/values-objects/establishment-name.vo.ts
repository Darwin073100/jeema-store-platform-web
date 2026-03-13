import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidNameException } from "../exceptions/invalid-name.exception";

interface NameProps{
    value: string;
}

export class EstablishmentNameVO extends ValueObject<NameProps> {
  private constructor(props: NameProps) {
    super(props);
  }

  /**
   * Crea una nueva instancia del Value Object Name.
   * Realiza validaciones para asegurar que el nombre sea válido.
   *
   * @param name El valor del nombre a encapsular.
   * @returns Una nueva instancia de Name.
   * @throws Error si el nombre es inválido (ej. vacío, muy largo).
   */
  public static create(name: string): EstablishmentNameVO {
    if (!name || name.trim().length === 0) {
      throw new InvalidNameException('El nombre no puede estar vacío.'); // Un error de dominio apropiado
    }
    if (name.length > 250) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidNameException('El nombre no debe ser mayor a 250 caracteres.');
    }
    if (name.length < 3) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidNameException('El nombre debe tener como mínimo 3 caracteres.');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new EstablishmentNameVO({ value:name });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): string {
    return this.props.value;
  }
}