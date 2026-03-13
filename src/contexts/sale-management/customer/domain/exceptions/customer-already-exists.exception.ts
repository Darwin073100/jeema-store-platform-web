import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class CustomerAlreadyExistsException extends DomainException{
    constructor(message:string){
        super(message);
    }
}