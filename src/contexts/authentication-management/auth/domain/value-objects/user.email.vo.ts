import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidUserException } from "../exceptions/invalid-user.exception";

interface UserEmailProp{
    value: string
}

export class UserEmailVO extends ValueObject<UserEmailProp>{
    private constructor (prop: UserEmailProp){
        super(prop)
    }

    static create(email: string):UserEmailVO{
        if(!email || email.length === 0){
            throw new InvalidUserException('El email no puede ir vacío.');
        } if(email.length > 100){
            throw new InvalidUserException('El email debe tener máximo 100 caracteres.');
        } if(email.length < 3){
            throw new InvalidUserException('El email debe tener mínimo 3 caracteres');
        }
        return new UserEmailVO({value: email});
    }

    /**
    * Getter para el valor del email.
    *  @return string
    */
    get value(): string {
        return this.props.value;
    }
}