import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class EstablishmentDetailNotFoundException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
