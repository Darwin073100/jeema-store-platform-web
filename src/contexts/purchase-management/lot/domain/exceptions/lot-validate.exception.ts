import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class LotValidateException extends DomainException{
    constructor(message: string){
        super(message);
        this.name = 'LotValidateException';
    }
}