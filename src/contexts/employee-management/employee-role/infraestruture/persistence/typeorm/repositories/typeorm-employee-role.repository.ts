// src/contexts/educational-center-management/educational-center/infrastructure/persistence/typeorm/repositories/typeorm-educational-center.repository.ts

import { InjectRepository } from '@nestjs/typeorm'; // Decoradores de NestJS para inyección
import { Injectable } from '@nestjs/common'; // Decorador de NestJS para hacer la clase inyectable
import { EmployeeRoleOrmEntity } from '../entities/employee-role-orm-entity';
import { QueryFailedError, Repository } from 'typeorm';
import { EmployeeRoleRepository } from 'src/contexts/employee-management/employee-role/domain/repositories/employee-role.repository';
import { EmployeeRoleEntity } from 'src/contexts/employee-management/employee-role/domain/entities/employee-role.entity';
import { EmployeeRoleNameVO } from 'src/contexts/employee-management/employee-role/domain/values-objects/employee-role-name.vo';
import { EmployeeRoleAlreadyExistsException } from 'src/contexts/employee-management/employee-role/domain/exceptions/employee-role-already-exists.exception';
import { EmployeeRoleMapper } from '../mappers/employee-role.mapper';
/**
 * TypeOrmEducationalCenterRepository es la implementación concreta de la interfaz
 * EducationalCenterRepository. Es parte de la capa de infraestructura y se encarga
 * de la persistencia de los objetos EducationalCenter utilizando TypeORM.
 *
 * Actúa como un adaptador entre el dominio puro y el ORM.
 */
@Injectable() // Hace que esta clase sea inyectable por el sistema de inyección de dependencias de NestJS
export class TypeOrmEmployeeRoleRepository implements EmployeeRoleRepository {
  private readonly typeOrmRepository: Repository<EmployeeRoleOrmEntity>;

  constructor(
    @InjectRepository(EmployeeRoleOrmEntity) // Inyecta el repositorio de TypeORM para EducationalCenterOrmEntity
    typeOrmRepository: Repository<EmployeeRoleOrmEntity>,
  ) {
    this.typeOrmRepository = typeOrmRepository;
  }

  /**
   * Guarda o actualiza un centro educativo en la base de datos.
   * Realiza la conversión entre la entidad de dominio y la entidad ORM.
   *
   * @param employeeRole La instancia de EducationalCenter a guardar.
   */
  async save(employeeRole: EmployeeRoleEntity): Promise<EmployeeRoleEntity> {
    try {
      // 1. Convertir la entidad de dominio a la entidad ORM.
      // Usamos el ID del dominio si existe para una actualización,
      // o creamos una nueva entidad ORM si es una nueva inserción.
      let ormEntity = await this.typeOrmRepository.findOne({
        where: { employeeRoleId: employeeRole.employeeRoleId as any }, // TypeORM puede necesitar un cast para bigint en algunos casos
      });

      if (ormEntity) {
        // Actualizar entidad existente
        ormEntity.name = employeeRole.name.value;
        ormEntity.updatedAt = employeeRole.updatedAt;
        ormEntity.deletedAt = employeeRole.deletedAt;
      } else {
        // Crear nueva entidad
        ormEntity = this.typeOrmRepository.create({
          // NO asignamos el ID aquí si es autogenerado por la DB (bigserial).
          // TypeORM lo manejará automáticamente en la inserción.
          name: employeeRole.name.value,
          createdAt: employeeRole.createdAt,
          updatedAt: employeeRole.updatedAt,
          deletedAt: employeeRole.deletedAt,
        });
      }

      const savedOrmEntity = await this.typeOrmRepository.save(ormEntity);
      
      return EmployeeRoleEntity.reconstitute(
        savedOrmEntity.employeeRoleId,
        EmployeeRoleNameVO.create(savedOrmEntity.name), // Reconstruimos el Value Object Name
        savedOrmEntity.createdAt,
        savedOrmEntity.updatedAt,
        savedOrmEntity.deletedAt,
      );
    } catch (error) {
      if(error instanceof QueryFailedError){
        const pgError = error as any;
        if(pgError.code === '23505'){
          throw new EmployeeRoleAlreadyExistsException('Ya existe un rol con ese nombre.');
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
  async findById(id: bigint): Promise<EmployeeRoleEntity | null> {
    // 1. Buscar la entidad ORM en la base de datos.
    const ormEntity = await this.typeOrmRepository.findOne({
      where: { employeeRoleId: id as any }, // TypeORM y BigInt
    });

    if (!ormEntity) {
      return null;
    }

    // 2. Reconstituir la entidad de dominio desde la entidad ORM.
    // Usamos el método de fábrica 'reconstitute' para crear la entidad de dominio
    // a partir de datos ya existentes, sin emitir eventos de dominio.
    return EmployeeRoleEntity.reconstitute(
      ormEntity.employeeRoleId,
      EmployeeRoleNameVO.create(ormEntity.name), // Reconstruimos el Value Object Name
      ormEntity.createdAt,
      ormEntity.updatedAt,
      ormEntity.deletedAt,
    );
  }

  async findByName(name: string): Promise<EmployeeRoleEntity | null> {
    const ormEntity = await this.typeOrmRepository.findOne({
      where: { name: name }, // TypeORM y BigInt
    });

    if (!ormEntity) {
      return null;
    }

    return EmployeeRoleEntity.reconstitute(
      ormEntity.employeeRoleId,
      EmployeeRoleNameVO.create(ormEntity.name), // Reconstruimos el Value Object Name
      ormEntity.createdAt,
      ormEntity.updatedAt,
      ormEntity.deletedAt,
    );
  }

  delete(entityId: bigint): Promise<EmployeeRoleEntity | null> {
    throw new Error('Este metodo no está implementado.');
  }

  async findAll(): Promise<[] | EmployeeRoleEntity[]> {
    const result = await this.typeOrmRepository.find({});
    return result.map(item => EmployeeRoleMapper.toDomainEntity(item))
  }
}