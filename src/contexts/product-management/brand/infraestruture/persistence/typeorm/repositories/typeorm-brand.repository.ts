import { BrandOrmEntity } from '../entities/brand-orm-entity';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { BrandRepository } from 'src/contexts/product-management/brand/domain/repositories/brand.repository';
import { BrandEntity } from 'src/contexts/product-management/brand/domain/entities/brand.entity';
import { BrandAlreadyExistsException } from 'src/contexts/product-management/brand/domain/exceptions/brand-already-exists.exception';
import { BrandMapper } from '../mappers/brand.mapper';
import { BrandNotFoundException } from 'src/contexts/product-management/brand/domain/exceptions/brand-not-found.exception';
import { getDataSource } from '@/configuration/databases/typeorm/config';

export class TypeOrmBrandRepository implements BrandRepository {
  private readonly typeOrmRepository: Repository<BrandOrmEntity>;

  constructor(
    readonly datasource: DataSource
  ) {
    this.typeOrmRepository = this.datasource.getRepository(BrandOrmEntity);
  }

  /**
   * Crea una instancia del repositorio (factory)
   * Uso: const repo = await TypeOrmAgregadoRepository.create();
   */
  static async create(): Promise<TypeOrmBrandRepository> {
    const dataSource = await getDataSource();
    return new TypeOrmBrandRepository(dataSource);
  }

  /**
   * Guarda o actualiza una marca en la base de datos.
   * Realiza la conversión entre la entidad de dominio y la entidad ORM.
   *
   * @param brand La instancia de Brand a guardar.
   */
  async save(brand: BrandEntity): Promise<BrandEntity> {
    try {
      let ormEntity = await this.typeOrmRepository.findOne({
        where: { brandId: brand.brandId as any }, // TypeORM puede necesitar un cast para bigint en algunos casos
      });

      if (ormEntity) {
        ormEntity.name = brand.name;
      } else {
        ormEntity = this.typeOrmRepository.create({
          name: brand.name,
          establishmentId: brand.establishemntId,
          createdAt: brand.createdAt,
          updatedAt: brand.updatedAt,
          deletedAt: brand.deletedAt,
        });
      }
      const savedOrmEntity = await this.typeOrmRepository.save(ormEntity);
      return BrandMapper.toDomainEntity(savedOrmEntity);
    } catch (error) {
      if(error instanceof QueryFailedError){
        const pgError = error as any;
        if(pgError.code === '23505'){
          throw new BrandAlreadyExistsException('Ya existe una marca con ese nombre.');
        }
      }

      throw error;
    }
  }

  /**
   * Busca una marca por su ID en la base de datos.
   * Realiza la conversión de la entidad ORM a la entidad de dominio.
   *
   * @param id El ID dela marca.
   * @returns Una Promesa que se resuelve con la instancia de EducationalCenter
   * si se encuentra, o `null` si no existe.
   */
  async findById(id: bigint): Promise<BrandEntity | null> {
    // 1. Buscar la entidad ORM en la base de datos.
    const ormEntity = await this.typeOrmRepository.findOne({
      where: { brandId: id as any }, // TypeORM y BigInt
    });

    if (!ormEntity) {
      return null;
    }

    // 2. Reconstituir la entidad de dominio desde la entidad ORM.
    // Usamos el método de fábrica 'reconstitute' para crear la entidad de dominio
    // a partir de datos ya existentes, sin emitir eventos de dominio.
    return BrandMapper.toDomainEntity(ormEntity);
  }
  async existById(id: bigint): Promise<BrandEntity | null> {
    const ormEntity = await this.typeOrmRepository.findOne({
      where: { brandId: id as any }, // TypeORM y BigInt
    });

    if (!ormEntity) {
      return null;
    }
    return BrandMapper.toDomainEntity(ormEntity);
  }

  //Eliminar una marca con softdelete y queryRunner
  async delete(entityId: bigint): Promise<BrandEntity | null> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ormEntity = await queryRunner.manager.findOne(BrandOrmEntity, {
        where: { brandId: entityId },
      });

      if (!ormEntity) {
        throw new BrandNotFoundException('Marca no encontrada');
      }

      // Creacion y ejecución del script
      await queryRunner.manager.query(
        `update brand set deleted_at = now() 
        where brand_id=${entityId};`
      );
      await queryRunner.commitTransaction();

      return BrandMapper.toDomainEntity(ormEntity);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<[] | BrandEntity[]> {
    const result = await this.typeOrmRepository.find({
      where: {
        deletedAt: undefined
      },
      order: {
        name: 'ASC'
      }
    });
    const brandList = result.map(item => BrandMapper.toDomainEntity(item));
    return brandList;
  }
  async findAllByEstablishment(establishmentId: bigint): Promise<BrandEntity[]> {
    const result = await this.typeOrmRepository.find({
      where: {
        establishmentId,
      },
      order: {
        name: 'ASC'
      }
    });
    const brandList = result.map(item => BrandMapper.toDomainEntity(item));
    return brandList;
  }
}