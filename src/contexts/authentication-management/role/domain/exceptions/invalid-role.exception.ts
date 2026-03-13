import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class InvalidRoleException extends DomainException{
  constructor(message: string){
    super(message);
  }  
}