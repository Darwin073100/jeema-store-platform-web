import { DomainException } from 'src/shared/domain/exceptions/domain.exceptions';

export class ImageLimitExceededException extends DomainException {
  constructor(message: string) {
    super(message, 422);
    this.name = 'ImageLimitExceededException';
  }
}
