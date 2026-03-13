import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { SaleInvalidException } from "../exceptions/sale-invalid.exception";

interface Prop{
    value: number;
}

export class SaleTaxAmountVO extends ValueObject<Prop> {
  // Aseguramos que el constructor sea privado para forzar el uso de métodos de fábrica
  // o para que solo ValueObject pueda crearlo si se gestiona internamente.
  private constructor(props: Prop) {
    super(props);
  }

  public static create(value: number): SaleTaxAmountVO {
    if (value && value < 0) {
      throw new SaleInvalidException('El % de impuestos no debe ser negativo.');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new SaleTaxAmountVO({ value });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): number {
    return Number(this.props.value);
  }
}