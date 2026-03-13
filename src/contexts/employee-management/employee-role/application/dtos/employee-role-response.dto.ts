/**
 * EmployeeRole ResponseDto es un Data Transfer Object (DTO)
 * que define la estructura de los datos que se enviarán como respuesta
 * a la capa de presentación después de una operación relacionada con
 * un EmployeeRole  (ej. creación, consulta).
 *
 * Contiene solo los datos de salida relevantes, mapeados desde la entidad de dominio.
 */
export class EmployeeRoleResponseDto {
  readonly employeeRoleId: string; // El ID del rol del empleado (como string para compatibilidad JSON)
  readonly name: string; // El nombre del rol del empleado
  readonly createdAt: Date; // La fecha de creación
  readonly updatedAt: Date | null; // La fecha de la última actualización
  readonly deletedAt: Date | null; // La fecha de borrado lógico

  constructor(
    employeeRoleId: string,
    name: string,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.employeeRoleId = employeeRoleId;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    Object.freeze(this);
  }
}