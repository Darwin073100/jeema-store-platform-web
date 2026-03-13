import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class InvalidCategoryException extends DomainException{
  constructor(message: string){
    super(message);
  }  
}