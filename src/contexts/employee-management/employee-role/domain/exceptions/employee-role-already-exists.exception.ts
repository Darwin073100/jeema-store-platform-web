import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class EmployeeRoleAlreadyExistsException extends DomainException{
    constructor(message: string){
        super(message);
    }
}