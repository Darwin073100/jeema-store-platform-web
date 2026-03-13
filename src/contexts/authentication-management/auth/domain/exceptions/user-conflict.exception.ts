import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class UserConflictException extends DomainException{
    constructor(message: string){
        super(message);
        this.name='UserConflictException';
    }
}