import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class LotNotFoundException extends DomainException{
    constructor(message: string){
        super(message);
        this.name = 'LotNotFoundException';
    }
}