import { RegisterEstablishmentDto } from '../dtos/register-establishment.dto';
import { EstablishmentRepository } from '../../domain/repositories/establishment.repository';
import { EstablishmentEntity } from '../../domain/entities/establishment.entity';

export class RegisterEstablishmentUseCase {
  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
  ) {}

  public async execute(command: RegisterEstablishmentDto): Promise<EstablishmentEntity> {
    const newEstablishment = EstablishmentEntity.create(command.name);
    const savedEntity = await this.establishmentRepository.save(newEstablishment);
    return savedEntity;
  }
}