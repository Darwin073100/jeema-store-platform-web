import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class CategoryNotFoundException extends DomainException{
    constructor(message: string){
        super(message);
    }
}