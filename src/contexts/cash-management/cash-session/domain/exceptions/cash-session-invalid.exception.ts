import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class CashSessionInvalidException extends DomainException {
    constructor(message: string) {
        super(`${message}`);
        this.name = 'CashSessionInvalidException';
    }
}