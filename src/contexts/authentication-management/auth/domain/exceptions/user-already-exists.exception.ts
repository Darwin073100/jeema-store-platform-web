import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class UserAlreadyExistsException extends DomainException{
    constructor(message: string){
        super(message)
    }
}
