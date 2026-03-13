import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { DataSource, Not, Repository } from "typeorm";
import { UserOrmEntity } from "../entities/user.orm-entity";
import { UserMapper } from "../mappers/user.mapper";
import { UserAlreadyExistsException } from "../../domain/exceptions/user-already-exists.exception";
import { UserNotFoundException } from "../../domain/exceptions/user-not-found.exception";

@Injectable()
export class TyperomUserRepository implements UserRepository {
    private repository: Repository<UserOrmEntity>;
    constructor(
        private dataSource: DataSource,
    ) {
        this.repository = this.dataSource.getRepository(UserOrmEntity);
    }

    async save(entity: UserEntity): Promise<UserEntity> {
        try {
            const isValidUsername = await this.findByUsername(entity.username.value);
            if (isValidUsername) {
                throw new UserAlreadyExistsException('El nombre de usuario ya existe.');
            }

            const isValidEmail = await this.findByEmail(entity.email.value);
            if (isValidEmail) {
                throw new UserAlreadyExistsException('El correo electrónico ya está en uso.');
            }
            const ormEntity = UserMapper.toOrmEntity(entity);
            const resp = await this.repository.save(ormEntity);
            return UserMapper.toDomain(resp);
        } catch (error) {
            throw error;
        }
    }

    async saveWithEmployee(entity: UserEntity): Promise<UserEntity> {
        try {
            const isValidUsername = await this.findByUsername(entity.username.value);
            if (isValidUsername) {
                throw new UserAlreadyExistsException('El nombre de usuario ya existe.');
            }

            const isValidEmail = await this.findByEmail(entity.email.value);
            if (isValidEmail) {
                throw new UserAlreadyExistsException('El correo electrónico ya está en uso.');
            }
            const ormEntity = UserMapper.toOrmEntity(entity);
            const resp = await this.repository.save(ormEntity);
            return UserMapper.toDomain(resp);
        } catch (error) {
            throw error;
        }

    }

    async update(establishmentId: bigint,user: UserEntity): Promise<UserEntity> {
        const isValidUsername = await this.repository.exists({
            where:{
                employee: {branchOffice: {establishmentId}},
                userId: Not(user.userId),
                username: user.username.value
            }
        });
        if (isValidUsername) {
            throw new UserAlreadyExistsException('El nombre de usuario ya existe.');
        }
        const isValidEmail = await this.repository.exists({
            where:{
                employee: {branchOffice: {establishmentId}},
                userId: Not(user.userId),
                email: user.email.value
            }
        });
        if (isValidEmail) {
            throw new UserAlreadyExistsException('El correo electrónico ya está en uso.');
        }

        const ormEntity = UserMapper.toOrmEntity(user);
        ormEntity.employee = undefined;
        ormEntity.userRoles = undefined;
        const result = await this.repository.save(ormEntity);
        const userResponse = UserMapper.toDomain(result);
        userResponse.updatePasswordHash('Empty123');
        return userResponse;
    }
    async existById(userId: bigint):Promise<UserEntity|null>{
        const result = await this.repository.findOneBy({
            userId
        });
        return result? UserMapper.toDomain(result): null;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const resp = await this.repository.findOne({
            where: {
                email: email as any,
                isActive: true,
            },
            relations: [
                'userRoles',
                'userRoles.role',
                'userRoles.role.rolePermissions',
                'userRoles.role.rolePermissions.permission'
            ]
        });

        if (!resp) {
            return null;
        }
        const entity = UserMapper.toDomain(resp);
        return entity;
    }

    async findByUsername(username: string): Promise<UserEntity | null> {
        const resp = await this.repository.findOne({
            where: { 
                username: username as any,
                isActive: true, 
            }
        });

        if (!resp) {
            return null;
        }
        const entity = UserMapper.toDomain(resp);
        return entity;
    }

    async findById(id: bigint): Promise<UserEntity | null> {
        const resp = await this.repository.findOne({
            where: {
                userId: id as any,
            },
            relations: [
                'userRoles',
                'employee',
                'userRoles.role',
                'userRoles.role.rolePermissions',
                'userRoles.role.rolePermissions.permission'
            ]
        });

        if (!resp) {
            return null;
        }
        const entity = UserMapper.toDomain(resp);
        return entity;
    }
    async findByIdWithWorkspace(id: bigint): Promise<UserEntity | null> {
        const resp = await this.repository.findOne({
            where: {
                userId: id as any,
                isActive: true,
            },
            relations: [
                'userRoles',
                'employee',
                'employee.branchOffice',
                'employee.branchOffice.establishment',
                'userRoles.role',
                'userRoles.role.rolePermissions',
                'userRoles.role.rolePermissions.permission'
            ]
        });

        if (!resp) {
            return null;
        }
        const entity = UserMapper.toDomain(resp);
        return entity;
    }

    async findAllByEstablishmentId(establishmentId: bigint): Promise<UserEntity[]> {
        const result = await this.repository.find({
            where: {
                employee: {
                    branchOffice: {
                        establishment: {
                            establishmentId
                        }
                    }
                }
            },
            relations: {
                employee: true
            }
        });
        return result.map(item => UserMapper.toDomain(item));
    }

}