import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidBranchOfficeException } from "../exceptions/invalid-branch-office.exception";

interface BranchOfficeNameProps{
    value: string;
}

/**
 * Name es un Value Object que encapsula la lógica y las reglas de negocio
 * para el nombre de un centro educativo (o cualquier otra entidad que lo requiera).
 *
 * Es inmutable, es decir, su valor no cambia una vez creado.
 * Se define por sus atributos y no tiene una identidad única.
 */
export class BranchOfficeNameVO extends ValueObject<BranchOfficeNameProps> {
  // Aseguramos que el constructor sea privado para forzar el uso de métodos de fábrica
  // o para que solo ValueObject pueda crearlo si se gestiona internamente.
  private constructor(props: BranchOfficeNameProps) {
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
  public static create(name: string): BranchOfficeNameVO {
    if (!name || name.trim().length === 0) {
      throw new InvalidBranchOfficeException('El nombre no puede estar vacío.'); // Un error de dominio apropiado
    }
    if (name.length > 250) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidBranchOfficeException('El nombre no debe ser mayor a 250 caracteres.');
    }
    if (name.length < 3) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidBranchOfficeException('El nombre debe tener como mínimo 3 caracteres.');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new BranchOfficeNameVO({ value:name });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): string {
    return this.props.value;
  }

  /**
   * Compara si dos Value Objects Name son iguales.
   * La igualdad se basa en el valor de sus propiedades.
   */
  // public equals(other: Name): boolean {
  //   if (other === null || other === undefined) {
  //     return false;
  //   }
  //   if (!(other instanceof Name)) {
  //     return false;
  //   }
  //   return this.value === other.value;
  // }
}