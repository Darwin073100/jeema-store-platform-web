import { DataSource, Repository } from 'typeorm';
import { EstablishmentDetailOrmEntity } from '../entities/establishment-detail.orm-entity';
import { EstablishmentDetailMapper } from '../mappers/establishment-detail.mapper';
import { EstablishmentDetailRepository } from 'src/contexts/establishment-management/establishment-detail/domain/repositories/establishment-detail.repository';
import { EstablishmentDetailEntity } from 'src/contexts/establishment-management/establishment-detail/domain/entities/establishment-detail.entity';
import { EstablishmentDetailTypeEnum } from 'src/contexts/establishment-management/establishment-detail/domain/enums/establishment-detail-type.enum';
import { getDataSource } from '@/configuration/databases/typeorm/config';

export class TypeOrmEstablishmentDetailRepository implements EstablishmentDetailRepository {
  private readonly typeOrmRepository: Repository<EstablishmentDetailOrmEntity>;

  constructor(private readonly datasource: DataSource) {
    this.typeOrmRepository = this.datasource.getRepository(EstablishmentDetailOrmEntity);
  }

  /**
   * Crea una instancia del repositorio (factory)
   * Uso: const repo = await TypeOrmEstablishmentDetailRepository.create();
   */
  static async create(): Promise<TypeOrmEstablishmentDetailRepository> {
    const dataSource = await getDataSource();
    return new TypeOrmEstablishmentDetailRepository(dataSource);
  }

  async save(detail: EstablishmentDetailEntity): Promise<EstablishmentDetailEntity> {
    const existing = detail.establishmentDetailId !== BigInt(0)
      ? await this.typeOrmRepository.findOneBy({ establishmentDetailId: detail.establishmentDetailId })
      : null;

    if (existing) {
      existing.value = detail.value;
      existing.sortOrder = detail.sortOrder;
      existing.updatedAt = detail.updatedAt;
      existing.deletedAt = detail.deletedAt;
      const saved = await this.typeOrmRepository.save(existing);
      return EstablishmentDetailMapper.toDomainEntity(saved);
    }

    const ormEntity = EstablishmentDetailMapper.toOrmEntity(detail);
    const saved = await this.typeOrmRepository.save(ormEntity);
    return EstablishmentDetailMapper.toDomainEntity(saved);
  }

  async findById(establishmentDetailId: bigint): Promise<EstablishmentDetailEntity | null> {
    const ormEntity = await this.typeOrmRepository.findOneBy({ establishmentDetailId });
    return ormEntity ? EstablishmentDetailMapper.toDomainEntity(ormEntity) : null;
  }

  async findAllByEstablishmentId(establishmentId: bigint): Promise<EstablishmentDetailEntity[]> {
    const ormEntities = await this.typeOrmRepository.find({
      where: { establishmentId },
      order: { sortOrder: 'ASC' },
    });
    return ormEntities.map((ormEntity) => EstablishmentDetailMapper.toDomainEntity(ormEntity));
  }

  async findByEstablishmentIdAndType(
    establishmentId: bigint,
    type: EstablishmentDetailTypeEnum,
  ): Promise<EstablishmentDetailEntity[]> {
    const ormEntities = await this.typeOrmRepository.find({
      where: { establishmentId, type },
      order: { sortOrder: 'ASC' },
    });
    return ormEntities.map((ormEntity) => EstablishmentDetailMapper.toDomainEntity(ormEntity));
  }

  async delete(establishmentDetailId: bigint): Promise<void> {
    await this.typeOrmRepository.softDelete({ establishmentDetailId });
  }
}
