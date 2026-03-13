import { RoleMapper } from "src/contexts/authentication-management/role/infraestructure/persistence/typeorm/mappers/role.mapper";
import { UserRoleEntity } from "../../domain/entities/user-role.entity";
import { UserRoleOrmEntity } from "../entities/user-role.orm-entity";
import { UserMapper } from "./user.mapper";

export class UserRoleMapper{
    static toDomain(ormEntity: UserRoleOrmEntity){
        const user = ormEntity.user? UserMapper.toDomain(ormEntity.user): null;
        const role = ormEntity.role? RoleMapper.toDomainEntity(ormEntity.role): null;
        let domainEntity = UserRoleEntity.reconstitute(
            ormEntity.userId,
            ormEntity.roleId,
            ormEntity.userRoleId,
            ormEntity.createdAt,
            user,
            role,
            ormEntity.updatedAt,
            ormEntity.deletedAt
        );
        return domainEntity;
    }

    static toOrmEntity(domainEntity: UserRoleEntity){
        const user = domainEntity.user? UserMapper.toOrmEntity(domainEntity.user): null;
        const role = domainEntity.role? RoleMapper.toTypeOrmEntity(domainEntity.role): null;
        const ormEntity = new UserRoleOrmEntity();
        ormEntity.userRoleId = domainEntity.userRoleId;
        ormEntity.userId = domainEntity.userId;
        ormEntity.roleId = domainEntity.roleId;
        ormEntity.user = user;
        ormEntity.role = role;
        ormEntity.createdAt = domainEntity.createdAt;
        ormEntity.updatedAt = domainEntity.updatedAt;
        ormEntity.deletedAt = domainEntity.deletedAt;
        return ormEntity;
    }
}