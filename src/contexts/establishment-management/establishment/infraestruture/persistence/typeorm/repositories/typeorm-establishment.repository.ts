import { EstablishmentOrmEntity } from '../entities/establishment-orm-entity';
import { EstablishmentRepository } from 'src/contexts/establishment-management/establishment/domain/repositories/establishment.repository';
import { EstablishmentEntity } from 'src/contexts/establishment-management/establishment/domain/entities/establishment.entity';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { EstablishmentNotFoundException } from 'src/contexts/establishment-management/establishment/domain/exceptions/establishment-not-found.exception';
import { EstablishmentAlreadyExistsException } from 'src/contexts/establishment-management/establishment/domain/exceptions/establishment-already-exists.exception';
import { EstablishmentMapper } from '../mappers/establishment.mapper';
import { getDataSource } from '@/configuration/databases/typeorm/config';
import { TransactionDBRepository } from '@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository';
import { TypeormTransactionDBRepository } from '@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository';

export class TypeOrmEstablishmentRepository implements EstablishmentRepository {
  private readonly typeOrmRepository: Repository<EstablishmentOrmEntity>;
  private readonly establishmentTransactionDB: Repository<EstablishmentOrmEntity>;

  constructor(private readonly datasource: DataSource, private readonly transactionDB: TransactionDBRepository) {
    this.typeOrmRepository = this.datasource.getRepository(EstablishmentOrmEntity);
    this.establishmentTransactionDB = this.transactionDB.getManager().getRepository(EstablishmentOrmEntity);
  }

  /**
   * Crea una instancia del repositorio (factory)
   * Uso: const repo = await TypeOrmAgregadoRepository.create();
   */
  static async create(): Promise<TypeOrmEstablishmentRepository> {
    const dataSource = await getDataSource();
    const tsDB = await TypeormTransactionDBRepository.create();
    return new TypeOrmEstablishmentRepository(dataSource, tsDB);
  }

  /**
   * Guarda o actualiza un centro educativo en la base de datos.
   * Realiza la conversión entre la entidad de dominio y la entidad ORM.
   *
   * @param establishment La instancia de EducationalCenter a guardar.
   */
  async save(establishment: EstablishmentEntity): Promise<EstablishmentEntity> {
    try {
      let ormEntity = await this.typeOrmRepository.findOne({
        where: { establishmentId: establishment.establishmentId }, // TypeORM puede necesitar un cast para bigint en algunos casos
      });

      if (ormEntity) {
        // Actualizar entidad existente
        ormEntity.name = establishment.name;
        ormEntity.updatedAt = establishment.updatedAt;
        ormEntity.deletedAt = establishment.deletedAt;
      } else {
        // Crear nueva entidad
        ormEntity = this.typeOrmRepository.create({
          // NO asignamos el ID aquí si es autogenerado por la DB (bigserial).
          // TypeORM lo manejará automáticamente en la inserción.
          name: establishment.name,
          createdAt: establishment.createdAt,
          updatedAt: establishment.updatedAt,
          deletedAt: establishment.deletedAt,
        });
      }

      const savedOrmEntity = await this.typeOrmRepository.save(ormEntity);
      return EstablishmentMapper.toDomainEntity(savedOrmEntity);
    } catch (error) {
      if(error instanceof QueryFailedError){
        const  pgError = error as any;
        if(pgError.code === '23505'){
          throw new EstablishmentAlreadyExistsException('Ya existe un establecimiento con ese nombre.');
        }
        if(pgError.code === '23503'){
          throw new EstablishmentNotFoundException('Establecimeinto no encontrado.');
        }
      }
      throw error;
    }
  }

  async transactionUpdate(establishment: EstablishmentEntity): Promise<EstablishmentEntity> {
    try {
      let ormEntity = await this.typeOrmRepository.findOne({
        where: { establishmentId: establishment.establishmentId }, // TypeORM puede necesitar un cast para bigint en algunos casos
      });

      if (ormEntity) {
        // Actualizar entidad existente
        ormEntity.name = establishment.name;
        ormEntity.cloudEstablishmentId = establishment.cloudEstablishmentId;
        ormEntity.enrollmentKey = establishment.enrollmentKey;
        ormEntity.updatedAt = establishment.updatedAt;
        ormEntity.deletedAt = establishment.deletedAt;
      } else {
        // Crear nueva entidad
        throw new EstablishmentNotFoundException('No encontramos el establecimiendo a editar.');
      }

      const savedOrmEntity = await this.establishmentTransactionDB.save(ormEntity);
      return EstablishmentMapper.toDomainEntity(savedOrmEntity);
    } catch (error) {
      if(error instanceof QueryFailedError){
        const  pgError = error as any;
        if(pgError.code === '23505'){
          throw new EstablishmentAlreadyExistsException('Ya existe un establecimiento con ese nombre.');
        }
        if(pgError.code === '23503'){
          throw new EstablishmentNotFoundException('Establecimeinto no encontrado.');
        }
      }
      throw error;
    }
  }

  /**
   * Busca un centro educativo por su ID en la base de datos.
   * Realiza la conversión de la entidad ORM a la entidad de dominio.
   *
   * @param id El ID del centro educativo.
   * @returns Una Promesa que se resuelve con la instancia de EducationalCenter
   * si se encuentra, o `null` si no existe.
   */
  async findById(id: bigint): Promise<EstablishmentEntity | null> {
    const ormEntity = await this.typeOrmRepository.findOne({
      where: { establishmentId: id as any },
      relations: {
        branchOffices: true
      }
    });

    if (!ormEntity) {
      return null;
    }

    return EstablishmentMapper.toDomainEntity(ormEntity);
  }
  async existById(establishmentId: bigint): Promise<EstablishmentEntity | null>{
    const ormEntity = await this.typeOrmRepository.findOne({
      where: { establishmentId }
    });

    if (!ormEntity) {
      return null;
    }

    return EstablishmentMapper.toDomainEntity(ormEntity);
  }
}