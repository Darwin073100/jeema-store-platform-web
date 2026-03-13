import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidInventoryException } from "../exceptions/invalid-inventory.exception";

interface Prop{
    value?: number|null;
}

export class InventorySaleQuantityManyVO extends ValueObject<Prop> {
  // Aseguramos que el constructor sea privado para forzar el uso de métodos de fábrica
  // o para que solo ValueObject pueda crearlo si se gestiona internamente.
  private constructor(props: Prop) {
    super(props);
  }

  public static create(name?: number|null): InventorySaleQuantityManyVO {
    if (name && name < 0) { // Un ejemplo de límite, puedes ajustar
      throw new InvalidInventoryException('La cantidad para vender el producto por mayoreo no puede ser negativo');
    }
    // Podrías añadir más validaciones: caracteres especiales, formato, etc.

    return new InventorySaleQuantityManyVO({ value:name });
  }

  /**
   * Getter para el valor del nombre.
   */
  get value(): number|null|undefined {
    return this.props.value;
  }
}