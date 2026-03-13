import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidInventoryException } from "../exceptions/invalid-inventory.exception";

interface Prop{
    value?: string|null;
}

export class InventoryInternalBarCodeVO extends ValueObject<Prop> {
  // Aseguramos que el constructor sea privado para forzar el uso de métodos de fábrica
  // o para que solo ValueObject pueda crearlo si se gestiona internamente.
  private constructor(props: Prop) {
    super(props);
  }

  public static create(name?: string|null): InventoryInternalBarCodeVO {

    if (name && name.length > 100) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidInventoryException('El codigo de barras interno no debe ser mayor a 100 caracteres.');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new InventoryInternalBarCodeVO({ value:name });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): string|undefined|null {
    return this.props.value;
  }
}