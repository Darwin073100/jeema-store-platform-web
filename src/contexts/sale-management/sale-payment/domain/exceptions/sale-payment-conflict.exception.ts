import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class SalePaymentConflictException extends DomainException {
    constructor(message: string) {
        super(message);
        this.name = 'SalePaymentConflictException';
    }
}