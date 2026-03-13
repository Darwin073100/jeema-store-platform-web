import { EstablishmentRepository } from '../../domain/repositories/establishment.repository';
import { EstablishmentEntity } from '../../domain/entities/establishment.entity';

export class FindEstablishmentByIdUseCase {
  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
  ) {}

  public async execute(id: bigint): Promise<EstablishmentEntity | null> {
    const establishment = await this.establishmentRepository.findById(id);
    return establishment;
  }
}