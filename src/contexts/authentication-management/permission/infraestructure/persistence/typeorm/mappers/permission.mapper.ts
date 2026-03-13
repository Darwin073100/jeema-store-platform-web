import { PermissionOrmEntity } from "../entities/permission.orm-entity";
import { UserRoleMapper } from "src/contexts/authentication-management/auth/infraestructure/mappers/user-role.mapper";
import { PermissionEntity } from "src/contexts/authentication-management/permission/domain/entities/permission-entity";
import { PermissionDescriptionVO } from "src/contexts/authentication-management/permission/domain/value-objects/permission-description.vo";
import { PermissionNameVO } from "src/contexts/authentication-management/permission/domain/value-objects/permission-name.vo";

export class PermissionMapper {
    // Domain to TypeORM
    static toTypeOrmEntity(domainEntity: PermissionEntity): PermissionOrmEntity {
        const rolePermissions = domainEntity?.rolePermissions?.map(item => UserRoleMapper.toOrmEntity(item));

        const typeOrmEntity = new PermissionOrmEntity();
        typeOrmEntity.permissionId = domainEntity.permissionId;
        typeOrmEntity.name = domainEntity.name.name;
        typeOrmEntity.description = domainEntity.description?.description;
        typeOrmEntity.rolePermissions = rolePermissions && [];
        typeOrmEntity.createdAt = domainEntity.createdAt;
        typeOrmEntity.updatedAt = domainEntity.updatedAt;
        typeOrmEntity.deletedAt = domainEntity.deletedAt;
        return typeOrmEntity;
    }

    // TypeORM to Domain
    static toDomainEntity(typeOrmEntity: PermissionOrmEntity): PermissionEntity {
        const rolePermisions = typeOrmEntity?.rolePermissions?.map(item => UserRoleMapper.toOrmEntity(item));
        
        return PermissionEntity.reconstitute(
            typeOrmEntity.permissionId,
            PermissionNameVO.create(typeOrmEntity.name),
            typeOrmEntity.createdAt,
            typeOrmEntity.updatedAt,
            typeOrmEntity.deletedAt,
            typeOrmEntity.description ? PermissionDescriptionVO.create(typeOrmEntity.description) : null,
            rolePermisions && [],
        );
    }
}