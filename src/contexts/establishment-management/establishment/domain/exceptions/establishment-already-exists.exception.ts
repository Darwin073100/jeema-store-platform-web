import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class EstablishmentAlreadyExistsException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}