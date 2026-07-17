// src/contexts/authentication/domain/models/user.model.ts
// Este es un 'Agregado Raíz' (Aggregate Root) y una 'Entidad' de Dominio.
import type { UserRoleEntity } from './user-role.entity';
import { DomainEvent } from 'src/shared/domain/events/domain-events';
import { UserUsernameVO } from '../value-objects/user.username.vo';
import { UserEmailVO } from '../value-objects/user.email.vo';
import { UserPasswordHashVO } from '../value-objects/user.password-hash.vo';
import type { EmployeeEntity } from 'src/contexts/employee-management/employee/domain/entities/employee.entity';

export class UserEntity {
  // Un error común es no tener un tipo explícito para los IDs,
  // especialmente cuando la base de datos usa `bigint`.
  private readonly _userId: bigint;
  private _employeeId: bigint;
  private _username: UserUsernameVO;
  private _email: UserEmailVO;
  private _passwordHash: UserPasswordHashVO; // El hash de la contraseña, no la contraseña en texto plano
  private _isActive: boolean;
  private _lastLogin?: Date | null;
  private _userRoles?: UserRoleEntity[] | [];
  private _createdAt: Date;
  private _updatedAt?: Date | null;
  private _deletedAt?: Date | null;
  private _employee?: EmployeeEntity|null;
  private _domainEvents: DomainEvent<this>[] = [];

  private constructor(
    userId: bigint,
    employeeId: bigint,
    username: UserUsernameVO,
    email: UserEmailVO,
    passwordHash: UserPasswordHashVO,
    isActive: boolean = true,
    lastLogin?: Date | null,
    createdAt: Date = new Date(),
    userRoles?: UserRoleEntity[] | [],
    employee?: EmployeeEntity|null,
    updatedAt?: Date | null,
    deletedAt?: Date | null,
  ) {
    this._userId = userId;
    this._employeeId = employeeId;
    this._username = username;
    this._email = email;
    this._passwordHash = passwordHash;
    this._isActive = isActive;
    this._createdAt = createdAt;
    this._lastLogin = lastLogin;
    this._userRoles = userRoles;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
    this._employee = employee;
  }

  static create(
    userId: bigint,
    employeeId: bigint,
    username: UserUsernameVO,
    email: UserEmailVO,
    passwordHash: UserPasswordHashVO,
  ) {
    const user = new UserEntity(
      userId,
      employeeId,
      username,
      email,
      passwordHash,
      true,
      null,
      new Date(),
      [],
      null,
      null,
      null,
    );

    return user;
  }

  /**
   * Este metodo es paran usuario con la informacion del empleado
   */
  static createWithEmployee(
    userId: bigint,
    employeeId: bigint,
    username: UserUsernameVO,
    email: UserEmailVO,
    passwordHash: UserPasswordHashVO,
    employee: EmployeeEntity
  ) {
    const user = new UserEntity(
      userId,
      employeeId,
      username,
      email,
      passwordHash,
      true,
      null,
      new Date(),
      [],
      employee, // employee
      null,
      null,
    );

    return user;
  }

  static reconstitute(
    userId: bigint,
    employeeId: bigint,
    username: UserUsernameVO,
    email: UserEmailVO,
    passwordHash: UserPasswordHashVO,
    isActive: boolean = true,
    lastLogin?: Date | null,
    createdAt: Date = new Date(),
    userRoles?: UserRoleEntity[] | [],
    employee?: EmployeeEntity|null,
    updatedAt?: Date | null,
    deletedAt?: Date | null,
  ) {
    const user = new UserEntity(
      userId,
      employeeId,
      username,
      email,
      passwordHash,
      isActive,
      lastLogin,
      createdAt,
      userRoles,
      employee,
      updatedAt,
      deletedAt,
    );

    return user;
  }

  get userId():bigint{
    return this._userId;
  }

  get userRoles(): UserRoleEntity[] | [] | undefined {
    return this._userRoles;
  }

  get employeeId(): bigint{
    return this._employeeId;
  }

  get username(): UserUsernameVO{
    return this._username;
  }

  get email(): UserEmailVO{
    return this._email;
  }

  get passwordHash(): UserPasswordHashVO{
    return this._passwordHash;
  }

  get isActive(): boolean{
    return this._isActive;
  }

  get lastLogin(): Date | null | undefined {
    return this._lastLogin;
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
  
  get employee(): EmployeeEntity | null | undefined {
    return this._employee;
  }
  public updateUsername(username: string){
    this._username = UserUsernameVO.create(username);
  }
  public updateEmail(email: string){
    this._email = UserEmailVO.create(email);
  }
  public updatePasswordHash(passwordHash: string){
    this._passwordHash = UserPasswordHashVO.create(passwordHash);
  }
  // Métodos de dominio (comportamiento)
  public markAsActive(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  public markAsInactive(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  public updateLastLogin(): void {
    this._lastLogin = new Date();
    this._updatedAt = new Date();
  }

  // Otros métodos que representen reglas de negocio o comportamiento del usuario
}
