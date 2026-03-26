import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class CashSessionNotFoundException extends DomainException {
    constructor(message: string) {
        super(`${message}`, 404);
        this.name = 'CashSessionNotFoundException';
    }
}