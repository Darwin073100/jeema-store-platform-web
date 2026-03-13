import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class CashRegisterNotFoundException extends DomainException{
    constructor( message: string){
        super(message);
        this.name = 'CashRegisterNotFoundException';
    }
}