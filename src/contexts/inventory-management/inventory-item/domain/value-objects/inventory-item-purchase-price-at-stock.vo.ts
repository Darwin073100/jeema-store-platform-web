import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidInventoryItemException } from "../exceptions/invalid-inventory-item.exception";

interface Prop{
    value: number;
}

export class InventoryItemPurchasePriceAtStockVO extends ValueObject<Prop> {
  // Aseguramos que el constructor sea privado para forzar el uso de métodos de fábrica
  // o para que solo ValueObject pueda crearlo si se gestiona internamente.
  private constructor(props: Prop) {
    super(props);
  }

  public static create(name: number): InventoryItemPurchasePriceAtStockVO {
    if (name < 0) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidInventoryItemException('El costo de entrada del producto en inventario no puede ser negativo.');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new InventoryItemPurchasePriceAtStockVO({ value:name });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): number {
    return this.props.value;
  }
}