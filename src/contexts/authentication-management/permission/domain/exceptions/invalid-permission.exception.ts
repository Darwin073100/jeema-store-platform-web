import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class InvalidPermissionException extends DomainException{
  constructor(message: string){
    super(message);
  }  
}