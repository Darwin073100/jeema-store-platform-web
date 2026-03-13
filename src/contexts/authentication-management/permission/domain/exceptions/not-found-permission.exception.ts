import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class NotFoundPermissionException extends DomainException{
    constructor(message: string){
        super(message);
    }
}