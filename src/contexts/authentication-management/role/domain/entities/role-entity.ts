import { DomainEvent } from 'src/shared/domain/events/domain-events';
import { RoleNameVO } from '../value-objects/role-name.vo';
import { RoleDescriptionVO } from '../value-objects/role-description.vo';
import { RoleCreatedEvent } from '../events/role-created.event';
import { UserRoleEntity } from 'src/contexts/authentication-management/auth/domain/entities/user-role.entity';

export class RoleEntity {
  private readonly _roleId: bigint;
  private _name: RoleNameVO;
  private _description?: RoleDescriptionVO | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date | null;
  private _deletedAt: Date | null;
  private _userRoles?: UserRoleEntity[]|[];
  private _permissions?: any[]; // Asegúrate de tipar correctamente según tu modelo
  private _domainEvents: DomainEvent<RoleEntity>[] = [];

  private constructor(
    roleId: bigint,
    name: RoleNameVO,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    description?: RoleDescriptionVO | null,
    userRoles?: UserRoleEntity[]|[],
  ) {
    this._roleId = roleId;
    this._name = name;
    this._description = description;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
    this._userRoles = userRoles;
  }

  /**
   * Crea una nueva instancia de Category.
   * Este es un método de fábrica para asegurar la creación controlada del agregado.
   * Un evento de dominio CategoryCreatedEvent se registra internamente.
   *
   * @param roleId El ID único de la categoría.
   * @param name El nombre del centro educativo.
   * @returns Una nueva instancia de Category.
   */

  static create(
    roleId: bigint,
    name: RoleNameVO,
    description?: RoleDescriptionVO | null,
  ): RoleEntity {
    const role = new RoleEntity(
      roleId,
      name,
      new Date(),
      null,
      null,
      description,
      [],
    );
    role.recordEvent(new RoleCreatedEvent(role));
    return role;
  }

  static reconstitute(
    roleId: bigint,
    name: RoleNameVO,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    description?: RoleDescriptionVO | null,
    userRoles?: UserRoleEntity[]|[],
  ): RoleEntity {
    return new RoleEntity(
      roleId,
      name,
      createdAt,
      updatedAt,
      deletedAt,
      description,
      userRoles,
    );
  }

  // Getters
  get roleId(): bigint {
    return this._roleId;
  }

  get name(): RoleNameVO {
    return this._name;
  }

  get description(): RoleDescriptionVO | null | undefined {
    return this._description;
  }

  get userRoles():UserRoleEntity[]|[]|undefined{
    return this._userRoles
  }
  
  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  get permissions(): any[] {
    return this._permissions || [];
  }

  // Métodos de comportamiento del dominio
    public updateName(newName: RoleNameVO): void {
      if (this._name.equals(newName)) {
        return; // No hay cambio, no se hace nada
      }
      this._name = newName;
      this._updatedAt = new Date();
      this.recordEvent(new RoleCreatedEvent(this)); // Un evento de ejemplo
    }

  // Métodos de comportamiento del dominio
    public updateDescription(newDescription: RoleDescriptionVO): void {
      if (this._description?.equals(newDescription)) {
        return; // No hay cambio, no se hace nada
      }
      this._description = newDescription;
      this._updatedAt = new Date();
      this.recordEvent(new RoleCreatedEvent(this)); // Un evento de ejemplo
    }
  

  public softDelete(): void {
    if (this._deletedAt) {
      return; // Ya está marcado como eliminado
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date(); // Actualizamos también la fecha de actualización
    // this.recordEvent(new EstablishmentDeletedEvent(this.id));
  }

  public restore(): void {
    if (!this._deletedAt) {
      return; // No está eliminado
    }
    this._deletedAt = null;
    this._updatedAt = new Date();
    // this.recordEvent(new EstablishmentRestoredEvent(this.id));
  }

   /**
   * Obtiene y borra los eventos de dominio registrados.
   * Este método será llamado por la capa de aplicación o infraestructura
   * después de que el agregado sea persistido o sus operaciones completadas.
   */
  public getAndClearEvents(): DomainEvent<RoleEntity>[] {
    const events = [...this._domainEvents];
    this._domainEvents = []; // Limpiar los eventos después de haberlos obtenido
    return events;
  }

  /**
   * Registra un evento de dominio para ser despachado posteriormente.
   * @param event El evento de dominio a registrar.
   */
  private recordEvent(event: DomainEvent<RoleEntity>): void {
    this._domainEvents.push(event);
  }

  public setPermissions(permissions: any[]): void {
    this._permissions = permissions;
  }
}
