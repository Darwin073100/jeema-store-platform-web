import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidUserException } from "../exceptions/invalid-user.exception";

interface UserPasswordHashProp{
    value: string
}

export class UserPasswordHashVO extends ValueObject<UserPasswordHashProp>{
    private constructor (prop: UserPasswordHashProp){
        super(prop)
    }

    static create(password: string):UserPasswordHashVO{
        if(!password || password.length === 0){
            throw new InvalidUserException('La contraseña no puede ir vacía.');
        } if(password.length > 255){
            throw new InvalidUserException('La contraseña debe tener máximo 255 caracteres.');
        } if(password.length < 3){
            throw new InvalidUserException('La contraseña debe tener mínimo 3 caracteres');
        }
        return new UserPasswordHashVO({value: password});
    }

    /**
    * Getter para el valor del password.
    *  @return string
    */
    get value(): string {
        return this.props.value;
    }
}