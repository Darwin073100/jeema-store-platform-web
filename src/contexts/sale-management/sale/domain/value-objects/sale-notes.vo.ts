import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { SaleInvalidException } from "../exceptions/sale-invalid.exception";

interface Prop{
    value: string | null;
}

export class SaleNotesVO extends ValueObject<Prop> {
  // Aseguramos que el constructor sea privado para forzar el uso de métodos de fábrica
  // o para que solo ValueObject pueda crearlo si se gestiona internamente.
  private constructor(props: Prop) {
    super(props);
  }

  public static create(value: string | null): SaleNotesVO {
    if ( !!value ) {
      if( value.length > 1500){
        throw new SaleInvalidException('Las notas no deben contener mas de 1,500 catacteres.');
      }
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new SaleNotesVO({ value });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): string | null {
    return this.props.value;
  }
}