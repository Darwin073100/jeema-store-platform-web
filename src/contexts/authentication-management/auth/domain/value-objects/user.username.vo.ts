import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidUserException } from "../exceptions/invalid-user.exception";

interface UserUsernameProp{
    value: string
}

export class UserUsernameVO extends ValueObject<UserUsernameProp>{
    private constructor (prop: UserUsernameProp){
        super(prop)
    }

    static create(username: string):UserUsernameVO{
        if(!username || username.length === 0){
            throw new InvalidUserException('El nombre de usuario no puede ir vacío.');
        } if(username.length > 100){
            throw new InvalidUserException('El nombre de usuario debe tener máximo 100 caracteres.');
        } if(username.length < 3){
            throw new InvalidUserException('El nombre de usuario debe tener mínimo 3 caracteres');
        }
        return new UserUsernameVO({value: username});
    }

    /**
    * Getter para el valor del nombre de usuario.
    *  @return string
    */
    get value(): string {
        return this.props.value;
    }
}