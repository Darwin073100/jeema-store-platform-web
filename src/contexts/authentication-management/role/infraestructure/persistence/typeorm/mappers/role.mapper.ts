import { RoleEntity } from "src/contexts/authentication-management/role/domain/entities/role-entity";
import { RoleOrmEntity } from "../entities/role.orm-entity";
import { RoleNameVO } from "src/contexts/authentication-management/role/domain/value-objects/role-name.vo";
import { RoleDescriptionVO } from "src/contexts/authentication-management/role/domain/value-objects/role-description.vo";
import { UserRoleMapper } from "src/contexts/authentication-management/auth/infraestructure/mappers/user-role.mapper";

export class RoleMapper {
    // Domain to TypeORM
    static toTypeOrmEntity(domainEntity: RoleEntity): RoleOrmEntity {
        const userRoles = domainEntity?.userRoles?.map(item => UserRoleMapper.toOrmEntity(item));

        const typeOrmEntity = new RoleOrmEntity();
        typeOrmEntity.roleId = domainEntity.roleId;
        typeOrmEntity.name = domainEntity.name.name;
        typeOrmEntity.description = domainEntity.description?.description;
        typeOrmEntity.userRoles = userRoles && [];
        typeOrmEntity.createdAt = domainEntity.createdAt;
        typeOrmEntity.updatedAt = domainEntity.updatedAt;
        typeOrmEntity.deletedAt = domainEntity.deletedAt;
        return typeOrmEntity;
    }

    // TypeORM to Domain
    static toDomainEntity(typeOrmEntity: RoleOrmEntity): RoleEntity {
        const userRoles = typeOrmEntity?.userRoles?.map(item => UserRoleMapper.toOrmEntity(item));
        // Extraer permisos desde rolePermissions
        const permissions = (typeOrmEntity.rolePermissions || [])
            .map(rp => rp.permission?.name)
            .filter(Boolean);
        const role = RoleEntity.reconstitute(
            typeOrmEntity.roleId,
            RoleNameVO.create(typeOrmEntity.name),
            typeOrmEntity.createdAt,
            typeOrmEntity.updatedAt,
            typeOrmEntity.deletedAt,
            typeOrmEntity.description ? RoleDescriptionVO.create(typeOrmEntity.description) : null,
            userRoles && [],
        );
        // Asignar permisos al objeto de dominio
        role.setPermissions(permissions);
        return role;
    }
}