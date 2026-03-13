import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class SuplierNotFoundException extends DomainException{
    constructor(message:string){
        super(message);
    }
}