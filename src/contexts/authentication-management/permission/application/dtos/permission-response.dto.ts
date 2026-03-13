export class PermissionResponseDto {
  readonly permissionId: string; // El ID del permiso (como string para compatibilidad JSON)
  readonly name: string; // El nombre del permiso
  readonly description?: string|null; // El nombre del permiso
  readonly createdAt: Date; // La fecha de creación
  readonly updatedAt: Date | null; // La fecha de la última actualización
  readonly deletedAt: Date | null; // La fecha de borrado lógico

  constructor(
    permissionId: string,
    name: string,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    description?: string|null,
  ) {
    this.permissionId = permissionId;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    Object.freeze(this);
  }
}
