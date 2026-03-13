import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class InvalidSeasonException extends DomainException{
    constructor(message: string){
        super(message)
    }
}