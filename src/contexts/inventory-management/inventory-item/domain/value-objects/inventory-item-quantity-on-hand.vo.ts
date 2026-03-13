import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidInventoryItemException } from "../exceptions/invalid-inventory-item.exception";

interface Prop{
    value: number;
}

export class InventoryItemQuantityOnHandVO extends ValueObject<Prop> {
  // Aseguramos que el constructor sea privado para forzar el uso de métodos de fábrica
  // o para que solo ValueObject pueda crearlo si se gestiona internamente.
  private constructor(props: Prop) {
    super(props);
  }

  public static create(name: number): InventoryItemQuantityOnHandVO {
    if (name < 0) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidInventoryItemException('El número de productos en inventario no puede ser negativo.');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new InventoryItemQuantityOnHandVO({ value:name });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): number {
    return Number(this.props.value);
  }
}