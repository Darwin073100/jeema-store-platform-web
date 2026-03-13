import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidPermissionException } from "../exceptions/invalid-permission.exception";

interface PermissionNameProps {
    value: string;
}

export class PermissionNameVO extends ValueObject<PermissionNameProps>{
    private constructor(props: PermissionNameProps){
        super(props)
    }

  /**
   * Crea una nueva instancia del Value Object PermissionNameVO.
   * Realiza validaciones para asegurar que el nombre sea válido.
   *
   * @param name El valor del nombre a encapsular.
   * @returns Una nueva instancia de PermissionName.
   * @throws Error si el nombre es inválido (ej. vacío, muy largo).
   */
  public static create(name: string): PermissionNameVO{
    if(!name || name.length === 0){
        throw new InvalidPermissionException('El nombre del permiso no puede ir vacio.'); 
    }
    if(name.length > 100){
        throw new InvalidPermissionException('El nombre del permiso no puede ser mayor a 100 catacteres.');
    }
    if(name.length < 3){
        throw new InvalidPermissionException('El nombre del permiso debe tener al menos 3 caracteres.');
    }

    return new PermissionNameVO({value: name });
  }

  /**
   * Getter para ver el valor del nombre del permiso.
   */
  get name(): string{
    return this.props.value;
  }
}