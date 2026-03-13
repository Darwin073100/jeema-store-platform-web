import { DataSource, Repository } from "typeorm";
import { UserRoleEntity } from "../../domain/entities/user-role.entity";
import { UserRoleRepository } from "../../domain/repositories/user-role.repository";
import { UserRoleOrmEntity } from "../entities/user-role.orm-entity";
import { UserRoleMapper } from "../mappers/user-role.mapper";
import { Injectable } from "@nestjs/common";
import { UserOrmEntity } from "../entities/user.orm-entity";
import { UserAlreadyExistsException } from "../../domain/exceptions/user-already-exists.exception";
import { EmployeeOrmEntity } from "src/contexts/employee-management/employee/infraestruture/persistence/typeorm/entities/employee-orm-entity";
import { UserNotFoundException } from "../../domain/exceptions/user-not-found.exception";

@Injectable()
export class TypeormUserRoleRepository implements UserRoleRepository{
    private userRoleRepository: Repository<UserRoleOrmEntity>;
    private userRepository: Repository<UserOrmEntity>;
    
    constructor(
      private readonly datasource: DataSource,
    ){
        this.userRoleRepository = this.datasource.getRepository(UserRoleOrmEntity);
        this.userRepository = this.datasource.getRepository(UserOrmEntity);
    }
    
    async save(entity: UserRoleEntity):Promise<UserRoleEntity>{
      const queryRunner = this.datasource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
       try {
         let ormEntity = UserRoleMapper.toOrmEntity(entity);
        const isValidUsername = await this.userRepository.findOne({where:{username: ormEntity.user?.username}});
        if(isValidUsername){
            throw new UserAlreadyExistsException('El nombre de usuario ya existe.');
        }

        const isValidEmail = await this.userRepository.findOne({where:{email: ormEntity.user?.email}});
        if(isValidEmail){
            throw new UserAlreadyExistsException('El correo electrónico ya está en uso.');
        }

        const employee = ormEntity.user?.employee;
        if(!employee){
          throw new Error('No pudimos dar de alta el usuario');
        }
        const employeeResult = await queryRunner.manager.save(EmployeeOrmEntity ,employee);
        
        let user = ormEntity.user;
        if(!user){
          throw new Error('No pudimos dar de alta el usuario');
        }

        user = {
          ...user,
          employeeId: employeeResult.employeeId,
          employee: undefined,
          userRoles: undefined,
        }
        const userResult = await queryRunner.manager.save(UserOrmEntity, user);
        
        ormEntity = {
          ...ormEntity,
          userId: userResult.userId,
          user: undefined,
        }
        const result = await queryRunner.manager.save(UserRoleOrmEntity, ormEntity);
        await queryRunner.commitTransaction();
        await queryRunner.release();
        return UserRoleMapper.toDomain(result);
       } catch (error) {
        throw error;
       }
    }
    async saveTwo(entity: UserRoleEntity):Promise<UserRoleEntity>{
      const queryRunner = this.datasource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
       try {
         let ormEntity = UserRoleMapper.toOrmEntity(entity);
        const isValidUsername = await this.userRepository.findOne({where:{username: ormEntity.user?.username}});
        if(isValidUsername){
            throw new UserAlreadyExistsException('El nombre de usuario ya existe.');
        }

        const isValidEmail = await this.userRepository.findOne({where:{email: ormEntity.user?.email}});
        if(isValidEmail){
            throw new UserAlreadyExistsException('El correo electrónico ya está en uso.');
        }
        
        let user = ormEntity.user;
        if(!user){
          throw new Error('No pudimos dar de alta el usuario');
        }

        user = {
          ...user,
          employeeId: user.employeeId,
          employee: undefined,
          userRoles: undefined,
        }
        const userResult = await queryRunner.manager.save(UserOrmEntity, user);
        
        ormEntity = {
          ...ormEntity,
          userId: userResult.userId,
          user: undefined,
        }
        const result = await queryRunner.manager.save(UserRoleOrmEntity, ormEntity);
        await queryRunner.commitTransaction();
        await queryRunner.release();
        return UserRoleMapper.toDomain(result);
       } catch (error) {
        throw error;
       }
    }

    async existById(userRoleId: bigint):Promise<UserRoleEntity|null>{
        const result = await this.userRoleRepository.findOneBy({
          userRoleId
        });
        return result? UserRoleMapper.toDomain(result): null;
    }
    async existByRole(userId: bigint, roleId):Promise<UserRoleEntity|null>{
        const result = await this.userRoleRepository.findOneBy({
            userId,
            roleId
        });
        return result? UserRoleMapper.toDomain(result): null;
    }

    async saveSecondImpl(entity: UserRoleEntity):Promise<UserRoleEntity>{
        const ormEntity = UserRoleMapper.toOrmEntity(entity);
        ormEntity.user = undefined;
        ormEntity.role = undefined;
        const result = await this.userRoleRepository.save(ormEntity);
        return UserRoleMapper.toDomain(result);
    }

    async update(entity: UserRoleEntity):Promise<UserRoleEntity>{
      try {
        let userRoleExist = await this.userRoleRepository.findOneBy({
          userRoleId: entity.userRoleId
        });
        if(!userRoleExist){
          throw new UserNotFoundException('No se encontro el rol a editar.');
        }
        userRoleExist = {
          ...userRoleExist,
          roleId: entity.roleId,
          deletedAt: entity.deletedAt
        }
        const result = await this.userRoleRepository.save(userRoleExist);
        return UserRoleMapper.toDomain(result);
      } catch (error) {
        throw error;
      }
    }


     // NUEVO: Implementación de findUserRoles
  async findUserRoles(userId: bigint): Promise<UserRoleEntity[]> {
    const userEntity = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role'], // Carga la relación de roles para el usuario
    });

    if (!userEntity || !userEntity) {
      return [];
    }
    // Mapeamos las RoleEntity a Role de dominio
    return userEntity.map(UserRoleMapper.toDomain);
  }
}