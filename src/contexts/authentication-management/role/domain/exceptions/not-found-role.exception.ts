import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class NotFoundRoleException extends DomainException{
    constructor(message: string){
        super(message);
    }
}