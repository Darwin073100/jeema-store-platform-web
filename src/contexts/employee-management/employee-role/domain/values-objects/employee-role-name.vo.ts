import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidEmployeeRoleException } from "../exceptions/invalid-employee-role.exception";

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
export class EmployeeRoleNameVO extends ValueObject<Prop> {
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
  public static create(name: string): EmployeeRoleNameVO {
    if (!name || name.trim().length === 0) {
      throw new InvalidEmployeeRoleException('El nombre del rol para empleados no puede estar vacío.'); // Un error de dominio apropiado
    }
    if (name.length > 100) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidEmployeeRoleException('El nombre del rol para empleados no debe ser mayor a 100 caracteres.');
    }
    if (name.length < 3) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidEmployeeRoleException('El nombre del rol para empleados debe tener como mínimo 3 caracteres.');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new EmployeeRoleNameVO({ value:name });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): string {
    return this.props.value;
  }
}