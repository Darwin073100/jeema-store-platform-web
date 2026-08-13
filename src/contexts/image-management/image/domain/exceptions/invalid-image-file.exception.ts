import { DomainException } from 'src/shared/domain/exceptions/domain.exceptions';

export class InvalidImageFileException extends DomainException {
  constructor(message: string) {
    super(message, 422);
    this.name = 'InvalidImageFileException';
  }
}
