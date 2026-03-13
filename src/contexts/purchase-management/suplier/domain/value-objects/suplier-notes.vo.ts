import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidSuplierException } from "../exceptions/invalid-suplier.exception";

interface Prop{
    value: string | null;
}

export class SuplierNotesVO extends ValueObject<Prop> {
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
  public static create(name: string | null): SuplierNotesVO {
    if(!name) return new SuplierNotesVO({ value:null });

    if (name.length > 1000) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidSuplierException('El comentario no debe ser mayor a 1,000 caracteres.');
    }
    return new SuplierNotesVO({ value:name });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): string | null {
    return this.props.value;
  }
}