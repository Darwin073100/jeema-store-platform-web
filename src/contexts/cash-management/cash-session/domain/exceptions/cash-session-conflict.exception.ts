import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class CashSessionConflictException extends DomainException {
    constructor(message: string){
        super(message);
    }
}