import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class UserNotFoundException extends DomainException{
    constructor(message: string){
        super(message);
    }
}