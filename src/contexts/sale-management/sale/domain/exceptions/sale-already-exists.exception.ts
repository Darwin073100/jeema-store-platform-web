import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class SaleAlreadyExistsException extends DomainException{
    constructor(message: string){
        super(message);
    }
}