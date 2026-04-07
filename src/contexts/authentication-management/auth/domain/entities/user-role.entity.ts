import { DomainEvent } from 'src/shared/domain/events/domain-events';
import { RoleEntity } from 'src/contexts/authentication-management/role/domain/entities/role-entity';
import { UserEntity } from './user.entity';
export class UserRoleEntity {
  // Un error común es no tener un tipo explícito para los IDs,
  // especialmente cuando la base de datos usa `bigint`.
  private _userRoleId: bigint;
  private readonly _userId: bigint;
  private _roleId: bigint;
  private _user?: UserEntity | null;
  private _role?: RoleEntity | null;
  private _createdAt: Date;
  private _updatedAt?: Date | null;
  private _deletedAt?: Date | null;
  private _domainEvents: DomainEvent<this>[] = [];

  private constructor(
    userId: bigint,
    roleId: bigint,
    userRoleId: bigint,
    createdAt: Date = new Date(),
    user?: UserEntity | null,
    role?: RoleEntity | null,
    updatedAt?: Date | null,
    deletedAt?: Date | null,
  ) {
        this._userRoleId = userRoleId;
        this._userId = userId;
        this._roleId = roleId;
        this._user = user;
        this._role = role;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
  }

  static create(
        userId: bigint,
        roleId:bigint,
  ) {
    const user = new UserRoleEntity(
      userId,
      roleId,
      BigInt(0),
      new Date(),
      null,
      null,
      null,
      null,
    );
    return user;
  }
  
  static createWithUser(
        userRoleId: bigint,
        roleId:bigint,
        userEntity: UserEntity,
  ) {
    const user = new UserRoleEntity(
      userEntity.userId,
      roleId,
      userRoleId,
      new Date(),
      userEntity,
      null,
      null,
      null,
    );

    return user;
  }

  static reconstitute(
    userId: bigint,
    roleId: bigint,
    userRoleId: bigint,
    createdAt: Date = new Date(),
    user?: UserEntity | null,
    role?: RoleEntity | null,
    updatedAt?: Date | null,
    deletedAt?: Date | null,
  ) {
    const userRole = new UserRoleEntity(
        userId,
        roleId,
        userRoleId,
        createdAt,
        user,
        role,
        updatedAt,
        deletedAt,
    );

    return userRole;
  }

  get userId(): bigint {
    return this._userId;
  }

  get roleId(): bigint{
    return this._roleId;
  }

  get userRoleId(): bigint{
    return this._userRoleId;
  }

  get role(): RoleEntity | null |  undefined{
    return this._role;
  }

  get user(): UserEntity | null | undefined{
    return this._user;
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

  get roleName(): string | undefined {
    return this._role?.name?.name;
  }

  get permissions(): string[] {
    // Los permisos ya están procesados como strings en RoleEntity._permissions
    return this._role?.rolePermissions || [];
  }
  updateRole(roleId: bigint){
    this._roleId = roleId;
    this._updatedAt = new Date();
  }
  softDelete(){
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }
}
