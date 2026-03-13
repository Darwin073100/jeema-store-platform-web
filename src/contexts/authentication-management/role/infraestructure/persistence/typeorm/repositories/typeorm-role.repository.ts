import { RoleOrmEntity } from '../entities/role.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleMapper } from '../mappers/role.mapper';
import { RoleRepository } from 'src/contexts/authentication-management/role/domain/repositories/role.repository';
import { QueryFailedError, Repository } from 'typeorm';
import { RoleEntity } from 'src/contexts/authentication-management/role/domain/entities/role-entity';
import { RoleAlreadyExistException } from 'src/contexts/authentication-management/role/domain/exceptions/role-already.exception';

export class TypeormRoleRepository implements RoleRepository {
  private readonly typeormRepository: Repository<RoleOrmEntity>;
  constructor(
    @InjectRepository(RoleOrmEntity)
    typeormRepository: Repository<RoleOrmEntity>,
  ) {
    this.typeormRepository = typeormRepository;
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    const ormEntity = await this.typeormRepository.findOne({
      where: { name: name },
    });
    if (!ormEntity) {
      return null;
    }
    return RoleMapper.toDomainEntity(ormEntity);
  }
  
  async findById(roleId: bigint): Promise<RoleEntity | null> {
    const ormEntity = await this.typeormRepository.findOne({
      where: { roleId: roleId },
    });
    if (!ormEntity) {
      return null;
    }
    return RoleMapper.toDomainEntity(ormEntity);
  }

  async findAll(): Promise<RoleEntity[]> {
    const result = await this.typeormRepository.find();
    return result.map(item => RoleMapper.toDomainEntity(item));
  }

  async save(entity: RoleEntity): Promise<RoleEntity> {
    try {
      let ormEntity = await this.typeormRepository.findOne({
        where: { roleId: entity.roleId },
      });

      if (ormEntity) {
        ormEntity.name = entity.name.name;
        ormEntity.description = entity.description?.description;
        ormEntity.updatedAt = entity.updatedAt;
        ormEntity.deletedAt = entity.deletedAt;
      } else {
        ormEntity = RoleMapper.toTypeOrmEntity(entity);
      }

      const savedOrmEntity = await this.typeormRepository.save(ormEntity);

      return RoleMapper.toDomainEntity(savedOrmEntity);
    } catch (error) {
        if(error instanceof QueryFailedError){
            const pgError = error as any;
            if(pgError.code === '23505'){
                throw new RoleAlreadyExistException('Ya existe un rol con ese nombre.');
            }
        }
        throw error;
    }
  }

  async existById(roleId: bigint):Promise<RoleEntity|null>{
      const result = await this.typeormRepository.findOneBy({
          roleId
      });
      return result? RoleMapper.toDomainEntity(result): null;
  }
}
