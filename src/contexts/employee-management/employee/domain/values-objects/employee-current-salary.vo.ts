import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidEmployeeException } from "../exceptions/invalid-employee.exception";

interface Prop{
    value: number | null;
}

/**
 * Name es un Value Object que encapsula la lógica y las reglas de negocio
 * para el Los apellidos de un centro educativo (o cualquier otra entidad que lo requiera).
 *
 * Es inmutable, es decir, su valor no cambia una vez creado.
 * Se define por sus atributos y no tiene una identidad única.
 */
export class EmployeeCurrentSalaryVO extends ValueObject<Prop> {
  // Aseguramos que el constructor sea privado para forzar el uso de métodos de fábrica
  // o para que solo ValueObject pueda crearlo si se gestiona internamente.
  private constructor(props: Prop) {
    super(props);

  }

  /**
   * Crea una nueva instancia del Value Object Name.
   * Realiza validaciones para asegurar que el Los apellidos sea válido.
   *
   * @param salary El valor del Los apellidos a encapsular.
   * @returns Una nueva instancia de Name.
   * @throws Error si el Los apellidos es inválido (ej. vacío, muy largo).
   */
  public static create(salary: number | null): EmployeeCurrentSalaryVO {
    if(!salary){
      return new EmployeeCurrentSalaryVO({ value:salary });
    }
    if (salary < 0) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidEmployeeException('El salario del empleado no puede ser negativo.');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new EmployeeCurrentSalaryVO({ value:salary });
  }

  /**
   * Getter para el valor del Los apellidos.
   */
  get value(): number | null {
    return this.props.value;
  }
}