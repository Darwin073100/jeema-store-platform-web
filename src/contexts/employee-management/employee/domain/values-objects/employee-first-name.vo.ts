import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidEmployeeException } from "../exceptions/invalid-employee.exception";

interface Prop{
    value: string;
}

/**
 * Name es un Value Object que encapsula la lógica y las reglas de negocio
 * para el nombre de un centro educativo (o cualquier otra entidad que lo requiera).
 *
 * Es inmutable, es decir, su valor no cambia una vez creado.
 * Se define por sus atributos y no tiene una identidad única.
 */
export class EmployeeFirstNameVO extends ValueObject<Prop> {
  // Aseguramos que el constructor sea privado para forzar el uso de métodos de fábrica
  // o para que solo ValueObject pueda crearlo si se gestiona internamente.
  private constructor(props: Prop) {
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
  public static create(name: string): EmployeeFirstNameVO {
    if (name.length > 100) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidEmployeeException('El nombre del empleado no debe ser mayor a 100 caracteres.');
    }
    if (name.length < 3) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidEmployeeException('El nombre del empleado debe tener como mínimo 3 caracteres.');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new EmployeeFirstNameVO({ value:name });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): string {
    return this.props.value;
  }
}