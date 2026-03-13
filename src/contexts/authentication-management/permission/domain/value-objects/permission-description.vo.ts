import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidPermissionException } from "../exceptions/invalid-permission.exception";

interface PermissionDescriptionPros{
    value?: string|null;
}

export class PermissionDescriptionVO extends ValueObject<PermissionDescriptionPros>{
/**
   * Crea una nueva instancia del Value Object PermissionDescription.
   * Realiza validaciones para asegurar que la descripcion sea valida.
   *
   * @param description El valor de la description a encapsular.
   * @returns Una nueva instancia de PermissionDescription.
   * @throws Error si la descripción es inválido (ej. mayor a 3 caracteres).
   */
  public static create( description?: string|null): PermissionDescriptionVO{
    if(description && description.length < 3){
        throw new InvalidPermissionException('La descripción debe tener mas de 3 caracteres.');
    }

    return new PermissionDescriptionVO({ value: description});
  }

  /**
   * Getter para ver el valor de la descripcion del permiso.
   */

  get description(): string|undefined|null{
    return this.props.value;
  }
}