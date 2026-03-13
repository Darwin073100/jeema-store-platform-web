import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class SalePaymentInvalidException extends DomainException {
    constructor(message: string) {
        super(message);
        this.name = 'SalePaymentInvalidException';
    }
}