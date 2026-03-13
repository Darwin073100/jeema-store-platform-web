import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class BrandNotFoundException extends DomainException{
    constructor(message: string) {
        super(message);
        this.name = 'BrandNotFoundException';
    }
}