import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class TransactionConflictException extends DomainException{
    constructor(message: string){
        super(message);
        this.name = 'TransactionConflictException';
    }
}