import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class InvalidUserException extends DomainException {
    constructor(message: string){
        super(message);
    }
}