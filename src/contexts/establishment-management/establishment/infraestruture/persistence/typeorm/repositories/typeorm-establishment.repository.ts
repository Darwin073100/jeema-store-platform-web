import { InjectRepository } from '@nestjs/typeorm'; // Decoradores de NestJS para inyección
import { Injectable } from '@nestjs/common'; // Decorador de NestJS para hacer la clase inyectable
import { EstablishmentOrmEntity } from '../entities/establishment-orm-entity';
import { EstablishmentRepository } from 'src/contexts/establishment-management/establishment/domain/repositories/establishment.repository';
import { EstablishmentEntity } from 'src/contexts/establishment-management/establishment/domain/entities/establishment.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { EstablishmentNotFoundException } from 'src/contexts/establishment-management/establishment/domain/exceptions/establishment-not-found.exception';
import { EstablishmentAlreadyExistsException } from 'src/contexts/establishment-management/establishment/domain/exceptions/establishment-already-exists.exception';
import { EstablishmentMapper } from '../mappers/establishment.mapper';

/**
 * TypeOrmEducationalCenterRepository es la implementación concreta de la interfaz
 * EducationalCenterRepository. Es parte de la capa de infraestructura y se encarga
 * de la persistencia de los objetos EducationalCenter utilizando TypeORM.
 *
 * Actúa como un adaptador entre el dominio puro y el ORM.
 */
@Injectable() // Hace que esta clase sea inyectable por el sistema de inyección de dependencias de NestJS
export class TypeOrmEstablishmentRepository implements EstablishmentRepository {
  private readonly typeOrmRepository: Repository<EstablishmentOrmEntity>;

  constructor(
    @InjectRepository(EstablishmentOrmEntity) // Inyecta el repositorio de TypeORM para EducationalCenterOrmEntity
    typeOrmRepository: Repository<EstablishmentOrmEntity>,
  ) {
    this.typeOrmRepository = typeOrmRepository;
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