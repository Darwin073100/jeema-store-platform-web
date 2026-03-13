import { DomainEvent } from 'src/shared/domain/events/domain-events';
import { PermissionNameVO } from '../value-objects/permission-name.vo';
import { PermissionDescriptionVO } from '../value-objects/permission-description.vo';
import { PermissionCreatedEvent } from '../events/permission-created.event';
import { UserRoleEntity } from 'src/contexts/authentication-management/auth/domain/entities/user-role.entity';
import { RolePermissionEntity } from 'src/contexts/authentication-management/role/domain/entities/role-permission.entity';

export class PermissionEntity {
  private readonly _permissionId: bigint;
  private _name: PermissionNameVO;
  private _description?: PermissionDescriptionVO | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date | null;
  private _deletedAt: Date | null;
  private _rolePermissions?: RolePermissionEntity[]|[];
  private _domainEvents: DomainEvent<PermissionEntity>[] = [];

  private constructor(
    permissionId: bigint,
    name: PermissionNameVO,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    description?: PermissionDescriptionVO | null,
    rolePermissions?: RolePermissionEntity[]|[],
  ) {
    this._permissionId = permissionId;
    this._name = name;
    this._description = description;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
    this._rolePermissions = rolePermissions;
  }

  /**
   * Crea una nueva instancia de Category.
   * Este es un método de fábrica para asegurar la creación controlada del agregado.
   * Un evento de dominio CategoryCreatedEvent se registra internamente.
   *
   * @param permissionId El ID único de la categoría.
   * @param name El nombre del centro educativo.
   * @returns Una nueva instancia de Category.
   */

  static create(
    permissionId: bigint,
    name: PermissionNameVO,
    description?: PermissionDescriptionVO | null,
  ): PermissionEntity {
    const permission = new PermissionEntity(
      permissionId,
      name,
      new Date(),
      null,
      null,
      description,
      [],
    );
    permission.recordEvent(new PermissionCreatedEvent(permission));
    return permission;
  }

  static reconstitute(
    permissionId: bigint,
    name: PermissionNameVO,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    description?: PermissionDescriptionVO | null,
    rolePermissions?: RolePermissionEntity[]|[],
  ): PermissionEntity {
    return new PermissionEntity(
      permissionId,
      name,
      createdAt,
      updatedAt,
      deletedAt,
      description,
      rolePermissions,
    );
  }

  // Getters
  get permissionId(): bigint {
    return this._permissionId;
  }

  get name(): PermissionNameVO {
    return this._name;
  }

  get description(): PermissionDescriptionVO | null | undefined {
    return this._description;
  }

  get rolePermissions():RolePermissionEntity[]|[]|undefined{
    return this._rolePermissions
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

  // Métodos de comportamiento del dominio
    public updateName(newName: PermissionNameVO): void {
      if (this._name.equals(newName)) {
        return; // No hay cambio, no se hace nada
      }
      this._name = newName;
      this._updatedAt = new Date();
      this.recordEvent(new PermissionCreatedEvent(this)); // Un evento de ejemplo
    }

  // Métodos de comportamiento del dominio
    public updateDescription(newDescription: PermissionDescriptionVO): void {
      if (this._description?.equals(newDescription)) {
        return; // No hay cambio, no se hace nada
      }
      this._description = newDescription;
      this._updatedAt = new Date();
      this.recordEvent(new PermissionCreatedEvent(this)); // Un evento de ejemplo
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
  public getAndClearEvents(): DomainEvent<PermissionEntity>[] {
    const events = [...this._domainEvents];
    this._domainEvents = []; // Limpiar los eventos después de haberlos obtenido
    return events;
  }

  /**
   * Registra un evento de dominio para ser despachado posteriormente.
   * @param event El evento de dominio a registrar.
   */
  private recordEvent(event: DomainEvent<PermissionEntity>): void {
    this._domainEvents.push(event);
  }
}
