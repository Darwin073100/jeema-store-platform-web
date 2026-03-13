import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidRoleException } from "../exceptions/invalid-role.exception";

interface RoleDescriptionProp{
    value?: string|null;
}

export class RoleDescriptionVO extends ValueObject<RoleDescriptionProp>{
/**
   * Crea una nueva instancia del Value Object CategoryName.
   * Realiza validaciones para asegurar que el nombre sea válido.
   *
   * @param description El valor de la description a encapsular.
   * @returns Una nueva instancia de Name.
   * @throws Error si el nombre es inválido (ej. vacío, muy largo).
   */
  public static create( description?: string|null): RoleDescriptionVO{
    if(description && description.length < 3){
        throw new InvalidRoleException('La descripción debe tener mas de 3 caracteres.');
    }

    return new RoleDescriptionVO({ value: description});
  }

  /**
   * Getter para ver el valor del nombre de la categoría.
   */

  get description(): string|undefined|null{
    return this.props.value;
  }
}