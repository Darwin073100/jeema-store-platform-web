import { Repository, QueryFailedError, DataSource } from "typeorm";
import { SeasonOrmEntity } from "../entities/season.orm-entity";
import { SeasonMapper } from "../mappers/season.mapper";
import { SeasonEntity } from "src/contexts/product-management/season/domain/entities/season.entity";
import { SeasonRepository } from "src/contexts/product-management/season/domain/repositories/season.repository";
import { SeasonAlreadyExistsException } from "src/contexts/product-management/season/domain/exceptions/season-already-exists.exception";
import { Injectable } from "@nestjs/common";
import { SeasonNotFoundException } from "src/contexts/product-management/season/domain/exceptions/season-not-found.exception";

@Injectable()
export class TypeormSeasonRepository implements SeasonRepository {
  private readonly typeormRepository: Repository<SeasonOrmEntity>;
  constructor(
    readonly datasource: DataSource,
  ) {
    this.typeormRepository = this.datasource.getRepository(SeasonOrmEntity);
  }

  async findById(seasonId: bigint): Promise<SeasonEntity | null> {
    const ormEntity = await this.typeormRepository.findOne({
      where: { seasonId: seasonId },
    });
    if (!ormEntity) {
      return Promise.resolve(null);
    }
    return SeasonMapper.toDomainEntity(ormEntity);
  }

  async findAll(): Promise<SeasonEntity[]> {
    const result = await this.typeormRepository.find({
      where: {
        deletedAt: undefined
      },
      order:{
        name: 'ASC'
      }
    });
    const seasonList = result.map(item => SeasonMapper.toDomainEntity(item)); 
    return seasonList;
  }
  
  async save(entity: SeasonEntity): Promise<SeasonEntity> {
    try {
      let ormEntity = await this.typeormRepository.findOne({
        where: { seasonId: entity.seasonId },
      });
      if (ormEntity) {
        ormEntity.name = entity.name;
        ormEntity.description = entity.description ?? null;
        ormEntity.dateInit = entity.dateInit;
        ormEntity.dateFinish = entity.dateFinish;
        ormEntity.updatedAt = entity.updatedAt;
        ormEntity.deletedAt = entity.deletedAt;
      } else {
        ormEntity = SeasonMapper.toOrmEntity(entity);
      }
      const saved = await this.typeormRepository.save(ormEntity);
      return SeasonMapper.toDomainEntity(saved);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const pgError = error as any;
        if (pgError.code === '23505') {
          throw new SeasonAlreadyExistsException('Ya existe una temporada con ese nombre.');
        }
      }
      throw error;
    }
  }

  // Eliminar una temporada con softdelete y querryRunner
  async delete(entityId: bigint): Promise<SeasonEntity | null> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const ormEntity = await queryRunner.manager.findOne(SeasonOrmEntity, {
        where: { seasonId: entityId },
      });
      if (!ormEntity) {
        throw new SeasonNotFoundException('La temporada especificada no existe.')
      }
      await queryRunner.manager.query(
        `UPDATE season SET deleted_at = NOW() WHERE season_id = ${entityId}`
      );
      await queryRunner.commitTransaction();
      return SeasonMapper.toDomainEntity(ormEntity);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async findAllByEstablishment(establishmentId: bigint): Promise<SeasonEntity[]> {
    const result = await this.typeormRepository.find({
      where: {
        establishmentId,
      },
      order: {
        name: 'ASC'
      }
    });
    const seasons = result.map(item => SeasonMapper.toDomainEntity(item));
    return seasons;
  }
}
