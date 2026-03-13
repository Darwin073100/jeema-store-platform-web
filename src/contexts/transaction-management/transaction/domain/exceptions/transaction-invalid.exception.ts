import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class TransactionInvalidException extends DomainException {
    constructor(message: string){
        super(message);
    }
}