import { RoleMapper } from "src/contexts/authentication-management/role/infraestructure/persistence/typeorm/mappers/role.mapper";
import { RolePermissionOrmEntity } from "../entities/role-permission.orm-entity";
import { PermissionMapper } from "src/contexts/authentication-management/permission/infraestructure/persistence/typeorm/mappers/permission.mapper";
import { RolePermissionEntity } from "src/contexts/authentication-management/role/domain/entities/role-permission.entity";

export class RolePermissionMapper{
    static toDomain(ormEntity: RolePermissionOrmEntity){
        const permission = ormEntity.permission? PermissionMapper.toDomainEntity(ormEntity.permission): null;
        const role = ormEntity.role? RoleMapper.toDomainEntity(ormEntity.role): null;
        let domainEntity = RolePermissionEntity.reconstitute(
            ormEntity.rolePermissionId,
            ormEntity.permissionId,
            ormEntity.roleId,
            ormEntity.createdAt,
            permission,
            role,
            ormEntity.updatedAt,
            ormEntity.deletedAt
        );
        // ...removed console.log...
        return domainEntity;
    }

    static toOrmEntity(domainEntity: RolePermissionEntity){
        const permission = domainEntity.permission? PermissionMapper.toTypeOrmEntity(domainEntity.permission): null;
        const role = domainEntity.role? RoleMapper.toTypeOrmEntity(domainEntity.role): null;
        const ormEntity = new RolePermissionOrmEntity();
        ormEntity.rolePermissionId = domainEntity.rolePermissionId;
        ormEntity.permissionId = domainEntity.permissionId;
        ormEntity.roleId = domainEntity.roleId;
        ormEntity.permission = permission;
        ormEntity.role = role;
        ormEntity.createdAt = domainEntity.createdAt;
        ormEntity.updatedAt = domainEntity.updatedAt;
        ormEntity.deletedAt = domainEntity.deletedAt;
        // ...removed console.log...
        return ormEntity;
    }
}