import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidCategoryException } from "../exceptions/invalid-category.exception";

interface CategoryDescriptionProp{
    value: string|null;
}

export class CategoryDescriptionVO extends ValueObject<CategoryDescriptionProp>{
/**
   * Crea una nueva instancia del Value Object CategoryName.
   * Realiza validaciones para asegurar que el nombre sea válido.
   *
   * @param description El valor de la description a encapsular.
   * @returns Una nueva instancia de Name.
   * @throws Error si el nombre es inválido (ej. vacío, muy largo).
   */
  public static create( description: string|null): CategoryDescriptionVO{
    if(description && description.length < 3){
        throw new InvalidCategoryException('La descripción debe tener mas de 3 caracteres.');
    }

    return new CategoryDescriptionVO({ value: description});
  }

  /**
   * Getter para ver el valor del nombre de la categoría.
   */

  get description(): string|null{
    return this.props.value;
  }
}