import { DomainEvent } from 'src/shared/domain/events/domain-events';
import { RoleEntity } from 'src/contexts/authentication-management/role/domain/entities/role-entity';
import { PermissionEntity } from 'src/contexts/authentication-management/permission/domain/entities/permission-entity';
export class RolePermissionEntity {
  // Un error común es no tener un tipo explícito para los IDs,
  // especialmente cuando la base de datos usa `bigint`.
  private _rolePermissionId: bigint;
  private readonly _permissionId: bigint;
  private readonly _roleId: bigint;
  private _permission?: PermissionEntity | null;
  private _role?: RoleEntity | null;
  private _createdAt: Date;
  private _updatedAt?: Date | null;
  private _deletedAt?: Date | null;
  private _domainEvents: DomainEvent<this>[] = [];

  private constructor(
    rolePermissionId: bigint,
    permissionId: bigint,
    roleId: bigint,
    createdAt: Date = new Date(),
    permission?: PermissionEntity | null,
    role?: RoleEntity | null,
    updatedAt?: Date | null,
    deletedAt?: Date | null,
  ) {
        this._rolePermissionId = rolePermissionId;
        this._permissionId = permissionId;
        this._roleId = roleId;
        this._permission = permission;
        this._role = role;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
  }

  static create(
        rolePermissionId: bigint,
        permissionId:bigint,
        roleEntity: RoleEntity,
  ) {
    const user = new RolePermissionEntity(
      rolePermissionId,
      permissionId,
      roleEntity.roleId,
      new Date(),
      null,
      roleEntity,
      null,
      null,
    );

    return user;
  }

  static reconstitute(
    rolePermissionId: bigint,
    permissionId: bigint,
    roleId: bigint,
    createdAt: Date = new Date(),
    permission?: PermissionEntity | null,
    role?: RoleEntity | null,
    updatedAt?: Date | null,
    deletedAt?: Date | null,
  ) {
    const rolePermission = new RolePermissionEntity(
        rolePermissionId,
        permissionId,
        roleId,
        createdAt,
        permission,
        role,
        updatedAt,
        deletedAt,
    );

    return rolePermission;
  }

  get permissionId(): bigint {
    return this._permissionId;
  }

  get roleId(): bigint{
    return this._roleId;
  }

  get rolePermissionId(): bigint{
    return this._rolePermissionId;
  }

  get role(): RoleEntity | null |  undefined{
    return this._role;
  }

  get permission(): PermissionEntity | null | undefined{
    return this._permission;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this._updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this._deletedAt;
  }
    // Otros métodos que representen reglas de negocio o comportamiento del usuario
}
