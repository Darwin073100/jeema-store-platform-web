import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class SuplierAlreadyExistsException extends DomainException{
    constructor(message:string){
        super(message);
    }
}