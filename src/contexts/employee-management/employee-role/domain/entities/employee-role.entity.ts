import { DomainEvent } from "src/shared/domain/events/domain-events";
import { EmployeeRoleNameVO } from "../values-objects/employee-role-name.vo";
import { EmployeeRoleCreatedEvent } from "../events/employee-role-created.event";
import { ProductEntity } from "src/contexts/product-management/product/domain/entities/product.entity";
import { EmployeeEntity } from "src/contexts/employee-management/employee/domain/entities/employee.entity";

export class EmployeeRoleEntity {
    private readonly _employeeRoleId: bigint;
    private _name: EmployeeRoleNameVO;
    private readonly _createdAt: Date;
    private _updatedAt: Date | null;
    private _deletedAt: Date | null;
    private _domainEvents: DomainEvent<this>[] = [];
    private _employees?: EmployeeEntity[];

    private constructor(
    employeeRoleId: bigint,
    name: EmployeeRoleNameVO,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    employees?: EmployeeEntity[] | null
    ) {
        this._employeeRoleId = employeeRoleId;
        this._name = name;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this._employees = employees ?? undefined;
    }

    /**
   * Crea una nueva instancia de EmployeeRole.
   * Este es un método de fábrica para asegurar la creación controlada del agregado.
   * Un evento de dominio EmployeeRoleCreatedEvent se registra internamente.
   *
   * @param employeeRoleId El ID único del role del empleado.
   * @param name El nombre del role del empleado.
   * @returns Una nueva instancia de EmployeeRole.
   */
  static create(employeeRoleId: bigint, name: EmployeeRoleNameVO): EmployeeRoleEntity {
    const employeeRole = new EmployeeRoleEntity(
      employeeRoleId,
      name,
      new Date(), // createdAt
      null, // updatedAt
      null, // deletedAt
      undefined // productos siempre undefined/null en create
    );
    // Registra el evento de dominio.
    employeeRole.recordEvent(new EmployeeRoleCreatedEvent(employeeRole));
    return employeeRole;
  }

  /**
   * Reconstituye una instancia de EmployeeRole desde la persistencia.
   * No emite eventos ya que representa un estado ya existente.
   *
   * @param employeeRoleId El ID único del role para el empleado.
   * @param name El nombre del role del empleado.
   * @param createdAt La fecha de creación.
   * @param updatedAt La fecha de la última actualización.
   * @param deletedAt La fecha de borrado lógico.
   * @returns Una instancia de EmployeeRole reconstituida.
   */
  static reconstitute(
    employeeRoleId: bigint,
    name: EmployeeRoleNameVO,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    employees?: EmployeeEntity[] | null
  ): EmployeeRoleEntity {
    return new EmployeeRoleEntity(employeeRoleId, name, createdAt, updatedAt, deletedAt, employees);
  }

  // Getters
  get employeeRoleId(): bigint {
    return this._employeeRoleId;
  }

  get name(): EmployeeRoleNameVO {
    return this._name;
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

  get employees(): EmployeeEntity[] | undefined {
    return this._employees;
  }

  /**
   * Obtiene y borra los eventos de dominio registrados.
   * Este método será llamado por la capa de aplicación o infraestructura
   * después de que el agregado sea persistido o sus operaciones completadas.
   */
  public getAndClearEvents(): DomainEvent<this>[] {
    const events = [...this._domainEvents];
    this._domainEvents = []; // Limpiar los eventos después de haberlos obtenido
    return events;
  }

  // Métodos de comportamiento del dominio
  public updateName(newName: EmployeeRoleNameVO): void {
    if (this._name.equals(newName)) {
      return; // No hay cambio, no se hace nada
    }
    this._name = newName;
    this._updatedAt = new Date();
    // Registra un evento de dominio si tienes uno para updateName, por ejemplo:
    // this.recordEvent(new EmployeeRoleCreatedEvent(this));
  }

  public softDelete(): void {
    if (this._deletedAt) {
      return; // Ya está marcado como eliminado
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date(); // Actualizamos también la fecha de actualización
    // this.recordEvent(new EmployeeRoleDeletedEvent(this.id));
  }

  public restore(): void {
    if (!this._deletedAt) {
      return; // No está eliminado
    }
    this._deletedAt = null;
    this._updatedAt = new Date();
    // this.recordEvent(new EmployeeRoleRestoredEvent(this.id));
  }
  /**
   * Registra un evento de dominio para ser despachado posteriormente.
   * @param event El evento de dominio a registrar.
   */
  private recordEvent(event: DomainEvent<this>): void {
    this._domainEvents.push(event);
  }
}

