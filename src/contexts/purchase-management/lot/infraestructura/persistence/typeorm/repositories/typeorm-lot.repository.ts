import { Inject, Injectable } from '@nestjs/common';
import { Between, DataSource, QueryFailedError, Repository } from 'typeorm';
import { LotRepository } from 'src/contexts/purchase-management/lot/domain/repositories/lot.repository';
import { LotEntity } from 'src/contexts/purchase-management/lot/domain/entities/lot.entity';
import { LotOrmEntity } from '../entities/lot.orm-entity';
import { LotMapper } from '../mappers/lot.mapper';
import { LotAlreadyExistsException } from 'src/contexts/purchase-management/lot/domain/exceptions/lot-already-exists.exception';
import { LotUnitPurchaseOrmEntity } from '../entities/lot-unit-purchase.orm-entity';
import { LotNotFoundException } from 'src/contexts/purchase-management/lot/domain/exceptions/lot-not-found.exception';
import { CONNECTION_DB_REPOSITORIO, ConnectionDBRepository } from 'src/config/database/typeorm/connection/domain/repositories/connection-repository';

@Injectable()
export class TypeOrmLotRepository implements LotRepository {
  private ormLotRepository: Repository<LotOrmEntity>;

  constructor(
    private readonly dataSource: DataSource,
    @Inject(CONNECTION_DB_REPOSITORIO)
    private readonly connection: ConnectionDBRepository
  ) {
    this.ormLotRepository = this.dataSource.getRepository(LotOrmEntity);
  }

  async saveWithItems(lotEntity: LotEntity): Promise<LotEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Conversion de una entidad de dominio a una entidad de Typeorm
      const lotOrmEntity = LotMapper.toOrm(lotEntity);
      const lotUnitPurchases = lotOrmEntity.lotUnitPurchases;
      // Limpiar lotUnitPurchases para evitar problemas de referencia circular
      const lotOrmEntityClean = {
        ...lotOrmEntity,
        lotUnitPurchases: undefined,
      }

      // Guardar la entidad

      let resp = await this.connection.getManager().getRepository(LotOrmEntity).save(lotOrmEntityClean);
      // Guardar las relaciones de lotUnitPurchases
      if (lotUnitPurchases && lotUnitPurchases.length > 0) {

        // verificar que no vengan repetidos los unidades de compra, 
        // lanzar un error si es así y hacer rollback de la transacción
        const uniqueUnits = new Set();
        for (const item of lotUnitPurchases) {
          if (uniqueUnits.has(item.lotUnitPurchaseId)) {
            throw new LotAlreadyExistsException('Los unidades de compra no pueden estar duplicados');
          }
          uniqueUnits.add(item.lotUnitPurchaseId);
        }
        // Asignar lotId a cada lotUnitPurchase
        lotUnitPurchases.forEach(item => {
          item.lotId = resp.lotId;
        });
        await queryRunner.manager.save(LotUnitPurchaseOrmEntity, lotUnitPurchases);
      }
      // Confirmar la transacción
      await queryRunner.commitTransaction();
      // Convertir una entidad de Typeorm a una entidad de dominio
      const resp2 = await this.ormLotRepository.findOne( {where:{
        lotId: resp.lotId
      }});
      return LotMapper.toDomain(resp2??resp);
    } catch (error) {
        // Revertir la transacción en caso de error
        await queryRunner.rollbackTransaction();

        if(error instanceof QueryFailedError) {
          const pgError = error as any;
          // Manejo de errores específicos de TypeORM
          if (pgError.code === '23505') { // Código de error para violación de clave única
            throw new LotAlreadyExistsException('Ya existe un lote con el mismo número de lote o producto.');
          }
        }
      throw error;
    }
  }

  async save(entity: LotEntity): Promise<LotEntity> {
    try {
      let lotExist = await this.ormLotRepository.findOneBy({
        lotId: entity.lotId
      });

      if(lotExist){
        lotExist.suplierId = entity.suplierId;
        lotExist.expirationDate = entity.expirationDate;
        lotExist.initialQuantity = entity.initialQuantity.toString();
        lotExist.lotNumber = entity.lotNumber;
        lotExist.manufacturingDate = entity.manufacturingDate;
        lotExist.purchasePrice = entity.purchasePrice.toString();
        lotExist.purchaseUnit = entity.purchaseUnit;
        lotExist.receivedDate = entity.receivedDate;

        const updateResult = await this.ormLotRepository.save(lotExist);
        const domainEntity = LotMapper.toDomain(updateResult);
        return domainEntity;
      }

      const ormEntity = LotMapper.toOrm(entity);
      const updateResult = await this.ormLotRepository.save(ormEntity);
      const domainEntity = LotMapper.toDomain(updateResult);
      return domainEntity;
      
    } catch (error) {
      throw error;
    }
  }

  async findById(id: bigint): Promise<LotEntity | null> {
    const lotOrmEntity = await this.ormLotRepository.findOne({
      where: { lotId: id },
      relations: ['product'],
    });
    if (!lotOrmEntity) {
      return null;
    }
    return LotMapper.toDomain(lotOrmEntity);
  }
  async findReport(branchOfficeId: bigint, dateInit: Date, dateFinish: Date): Promise<LotEntity[]> {
    const lotOrmEntity = await this.ormLotRepository.find({
      where: { 
        receivedDate: Between(dateInit, dateFinish),
        product: {
        establishment:{
          branchOffices: {
            branchOfficeId
            }
          }
        }
      },
      relations: {
        product: {
          inventory: true,
          category: true,
          season: true,
        },
        suplier:true
      },
      
      order:{
        receivedDate: 'DESC'
      }
    });

    return lotOrmEntity.map(item => LotMapper.toDomain(item));
  }

  async delete(entityId: bigint): Promise<LotEntity | null> {
    const entityExist = await this.ormLotRepository.findOne({
      where: {
        lotId: entityId
      }
    });

    if(!entityExist){
      throw new LotNotFoundException('El lote especificado no se encontro.');
    }

    await this.ormLotRepository.query(`UPDATE lot SET deleted_at = NOW() WHERE lot_id = ${ entityId };`);

    return LotMapper.toDomain(entityExist);
  }

  findAll(): Promise<LotEntity[]> {
    throw new Error('Este metodo no esta implementado');
  }
}
