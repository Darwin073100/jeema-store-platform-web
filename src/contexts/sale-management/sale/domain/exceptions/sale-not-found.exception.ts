import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class SaleNotFoundException extends DomainException{
    constructor(message: string){
        super(message);
    }
}