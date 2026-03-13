import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidRoleException } from "../exceptions/invalid-role.exception";

interface RoleNameProps {
    value: string;
}

export class RoleNameVO extends ValueObject<RoleNameProps>{
    private constructor(props: RoleNameProps){
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
  public static create(name: string): RoleNameVO{
    if(!name || name.length === 0){
        throw new InvalidRoleException('El nombre del rol no puede ir vacio.'); 
    }
    if(name.length > 50){
        throw new InvalidRoleException('El nombre del rol no puede ser mayor a 50 catacteres.');
    }
    if(name.length < 3){
        throw new InvalidRoleException('El nombre del rol debe tener al menos 3 caracteres.');
    }

    return new RoleNameVO({value: name });
  }

  /**
   * Getter para ver el valor del nombre del rol.
   */
  get name(): string{
    return this.props.value;
  }
}