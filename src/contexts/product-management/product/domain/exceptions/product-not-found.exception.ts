import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class ProductNotFoundException extends DomainException{
    constructor(message: string){
        super(message);
        this.name = 'ProductNotFoundException';
    }
}