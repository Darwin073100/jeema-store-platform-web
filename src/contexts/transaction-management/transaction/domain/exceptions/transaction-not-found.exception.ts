import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class TransactionNotFoundException extends DomainException{
    constructor(message: string){
        super(message);
    }
}