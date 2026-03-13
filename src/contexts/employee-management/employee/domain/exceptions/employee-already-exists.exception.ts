import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class EmployeeAlreadyExistsException extends DomainException{
    constructor(message: string){
        super(message);
    }
}