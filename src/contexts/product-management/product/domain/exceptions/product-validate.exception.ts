import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class ProductValidateException extends DomainException{
    constructor(message: string) {
        super(message);
        this.name = 'ProductValidateException';
    }
}