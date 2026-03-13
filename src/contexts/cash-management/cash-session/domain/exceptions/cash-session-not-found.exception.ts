import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class CashSessionNotFoundException extends DomainException {
    constructor(message: string) {
        super(`${message}`);
        this.name = 'CashSessionNotFoundException';
    }
}