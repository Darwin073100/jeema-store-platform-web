import { PermissionOrmEntity } from '../entities/permission.orm-entity';
import { PermissionMapper } from '../mappers/permission.mapper';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { RoleAlreadyExistException } from 'src/contexts/authentication-management/role/domain/exceptions/role-already.exception';
import { PermissionRepository } from 'src/contexts/authentication-management/permission/domain/repositories/permission.repository';
import { PermissionEntity } from 'src/contexts/authentication-management/permission/domain/entities/permission-entity';
import { getDataSource } from '@/configuration/databases/typeorm/config';

export class TypeormPermissionRepository implements PermissionRepository {
  private readonly typeormRepository: Repository<PermissionOrmEntity>;
  constructor(
    private readonly datasource: DataSource
  ) {
    this.typeormRepository = this.datasource.getRepository(PermissionOrmEntity);
  }

  /**
   * Crea una instancia del repositorio (factory)
   * Uso: const repo = await TypeOrmAgregadoRepository.create();
   */
  static async create(): Promise<TypeormPermissionRepository> {
    const dataSource = await getDataSource();
    return new TypeormPermissionRepository(dataSource);
  }

  async findByName(name: string): Promise<PermissionEntity | null> {
    const ormEntity = await this.typeormRepository.findOne({
      where: { name: name },
    });
    if (!ormEntity) {
      return null;
    }
    return PermissionMapper.toDomainEntity(ormEntity);
  }
  async findById(permissionId: bigint): Promise<PermissionEntity | null> {
    const ormEntity = await this.typeormRepository.findOne({
      where: { permissionId: permissionId },
    });
    if (!ormEntity) {
      return null;
    }
    return PermissionMapper.toDomainEntity(ormEntity);
  }

  findAll(): Promise<PermissionEntity[]> {
    throw new Error('Method not implemented.');
  }

  async save(entity: PermissionEntity): Promise<PermissionEntity> {
    try {
      let ormEntity = await this.typeormRepository.findOne({
        where: { permissionId: entity.permissionId },
      });

      if (ormEntity) {
        ormEntity.name = entity.name.name;
        ormEntity.description = entity.description?.description;
        ormEntity.updatedAt = entity.updatedAt;
        ormEntity.deletedAt = entity.deletedAt;
      } else {
        ormEntity = PermissionMapper.toTypeOrmEntity(entity);
      }

      const savedOrmEntity = await this.typeormRepository.save(ormEntity);

      return PermissionMapper.toDomainEntity(savedOrmEntity);
    } catch (error) {
      // Lanzamos una exception de dominio de que ya hay un registro con ese nombre del codigo de error de typeorm..
        if(error instanceof QueryFailedError){
            const pgError = error as any;
            if(pgError.code === '23505'){
                throw new RoleAlreadyExistException('Ya existe un permiso con ese nombre.');
            }
        }
        throw error;
    }
  }
  delete(entityId: bigint): Promise<PermissionEntity | null> {
    throw new Error('Este metodo no se ha implementado.')
  }
}
