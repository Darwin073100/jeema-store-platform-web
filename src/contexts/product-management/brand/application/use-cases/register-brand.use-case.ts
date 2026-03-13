import { RegisterBrandDto } from '../dtos/register-brand.dto';
import { BrandRepository } from '../../domain/repositories/brand.repository';
import { BrandEntity } from '../../domain/entities/brand.entity';

export class RegisterBrandUseCase {
  constructor(
    private readonly brandRepository: BrandRepository,
  ) {}

  public async execute(command: RegisterBrandDto): Promise<BrandEntity> {
    const newBrand = BrandEntity.create(command.establishmentId, command.name);
    const savedEntity = await this.brandRepository.save(newBrand);
    return savedEntity;
  }
}