import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class SalePaymentNotFoundException extends DomainException {
    constructor(message: string){
        super(message);
    }
}