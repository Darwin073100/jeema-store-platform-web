import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class CustomerNotFountException extends DomainException {
    constructor(message: string){
        super(message);
    }
}