import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidCategoryException } from "../exceptions/invalid-category.exception";

interface CategoryNameProps {
    value: string;
}

export class CategoryNameVO extends ValueObject<CategoryNameProps>{
    private constructor(props: CategoryNameProps){
        super(props)
    }

  /**
   * Crea una nueva instancia del Value Object CategoryName.
   * Realiza validaciones para asegurar que el nombre sea válido.
   *
   * @param name El valor del nombre a encapsular.
   * @returns Una nueva instancia de Name.
   * @throws Error si el nombre es inválido (ej. vacío, muy largo).
   */
  public static create(name: string): CategoryNameVO{
    // ...removed console.log...
    if(!name || name.length === 0){
        throw new InvalidCategoryException('El nombre de la categoría no puede ir vacio.'); 
    }
    if(name.length > 100){
        throw new InvalidCategoryException('El nombre de la categoría no puede ser mayor a 100 catacteres.');
    }
    if(name.length < 3){
        throw new InvalidCategoryException('El nombre de la categoria debe tener al menos 3 caracteres.');
    }

    return new CategoryNameVO({value: name });
  }

  /**
   * Getter para ver el valor del nombre de la categoría.
   */
  get name(): string{
    return this.props.value;
  }
}