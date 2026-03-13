import { Inject, Injectable } from '@nestjs/common'; // Decorador de NestJS para hacer la clase inyectable
import { EmployeeOrmEntity } from '../entities/employee-orm-entity';
import { DataSource, Entity, QueryFailedError, Repository } from 'typeorm';
import { EmployeeEntity } from 'src/contexts/employee-management/employee/domain/entities/employee.entity';
import { EmployeeRepository } from 'src/contexts/employee-management/employee/domain/repositories/employee.repository';
import { EmployeeMapper } from '../mappers/employee.mapper';
import { AddressOrmEntity } from 'src/shared/infraestructure/typeorm/address.orm-entity';
import { CONNECTION_DB_REPOSITORIO, ConnectionDBRepository } from 'src/config/database/typeorm/connection/domain/repositories/connection-repository';
import { EmployeeNotFoundException } from 'src/contexts/employee-management/employee/domain/exceptions/employee-not-found.exception';
/**
 * TypeOrmEducationalCenterRepository es la implementación concreta de la interfaz
 * EducationalCenterRepository. Es parte de la capa de infraestructura y se encarga
 * de la persistencia de los objetos EducationalCenter utilizando TypeORM.
 *
 * Actúa como un adaptador entre el dominio puro y el ORM.
 */
@Injectable() // Hace que esta clase sea inyectable por el sistema de inyección de dependencias de NestJS
export class TypeOrmEmployeeRepository implements EmployeeRepository {
  private readonly typeOrmRepository: Repository<EmployeeOrmEntity>;

  constructor(
    private readonly datasource: DataSource,
    @Inject(CONNECTION_DB_REPOSITORIO)
    private readonly connection: ConnectionDBRepository
  ) {
    this.typeOrmRepository = this.datasource.getRepository(EmployeeOrmEntity);
  }

  /**
   * Guarda o actualiza un centro educativo en la base de datos.
   * Realiza la conversión entre la entidad de dominio y la entidad ORM.
   *
   * @param employeeRole La instancia de EducationalCenter a guardar.
   */
  async save(employee: EmployeeEntity): Promise<EmployeeEntity> {
    try {
      const addressRepository = this.connection.getManager().getRepository(AddressOrmEntity);
      let employeeOrmEntity = EmployeeMapper.toOrmEntity(employee);
      let addressResponse: AddressOrmEntity| null = null;
      if(!!employeeOrmEntity.address){
        addressResponse = await addressRepository.save(employeeOrmEntity.address);
        employeeOrmEntity.address = null;
      }
      const result = await this.connection.getManager().save(employeeOrmEntity);
      result.address = addressResponse;
      result.addressId = addressResponse?.addressId ?? null;
      return EmployeeMapper.toDomainEntity(result);
    } catch (error) {
      throw error;
    }
  }

  async update(employee: EmployeeEntity): Promise<EmployeeEntity> {
    try {
      let employeeExist = await this.typeOrmRepository.findOneBy({
        employeeId: employee.employeeId
      });
      if(!employeeExist){
        throw new EmployeeNotFoundException('El empleado a editar no existe.');
      }
      employeeExist = {
        ...employeeExist,
        branchOfficeId: employee.branchOfficeId,
        employeeRoleId: employee.employeeRoleId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        phoneNumber: employee.phoneNumber,
        email: employee.email,
        birthDate: employee.birthDate,
        gender: employee.gender,
        hireDate: employee.hireDate,
        terminationDate: employee.terminationDate,
        currentSalary: employee.currentSalary,
        isActive: employee.isActive,
        photoUrl: employee.photoUrl,
        entryTime: employee.entryTime,
        exitTime: employee.exitTime
      }
      const result = await this.typeOrmRepository.save(employeeExist);
      return EmployeeMapper.toDomainEntity(result);
    } catch (error) {
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
  async findById(id: bigint): Promise<EmployeeEntity | null> {
    // 1. Buscar la entidad ORM en la base de datos.
    const ormEntity = await this.typeOrmRepository.findOne({
      where: { employeeId: id as any }, // TypeORM y BigInt
      relations: {
        address: true,
        user: {
          userRoles:{
            role: true,
            user: false,
          }
        },
        employeeRole: true
      }
    });

    if (!ormEntity) {
      return null;
    }

    // 2. Reconstituir la entidad de dominio desde la entidad ORM.
    // Usamos el método de fábrica 'reconstitute' para crear la entidad de dominio
    // a partir de datos ya existentes, sin emitir eventos de dominio.
    return EmployeeMapper.toDomainEntity(ormEntity);
  }

  async existById(employeeId: bigint): Promise<boolean> {
    return await this.typeOrmRepository.existsBy({
      employeeId
    });
  }

  async delete(entityId: bigint): Promise<EmployeeEntity | null> {
    try {
      const employeeExist = await this.typeOrmRepository.findOne({
        where: {
          employeeId: entityId
        },
        relations:{
          address: true
        }
      });

      if(employeeExist){
        await this.typeOrmRepository.delete({employeeId: entityId});
        return EmployeeMapper.toDomainEntity(employeeExist);
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  findAll(): Promise<EmployeeEntity[]> {
    throw new Error('Este metodo no esta implementado.');
  }
  async findAllByEstablishmentId(establishmentId: bigint): Promise<EmployeeEntity[]> {
    const result = await this.typeOrmRepository.find({
      where: {
        branchOffice: {
          establishment: {
            establishmentId
          }
        }
      },
      relations: {
        employeeRole: true
      }
    });
    return result.map(item => EmployeeMapper.toDomainEntity(item));
  }
}