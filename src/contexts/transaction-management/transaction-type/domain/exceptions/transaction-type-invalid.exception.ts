import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class TransactionTypeInvalidException extends DomainException{
    constructor(message: string){
        super(message);
    }
}