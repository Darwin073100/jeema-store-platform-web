export class RoleResponseDto {
  readonly roleId: string; // El ID del centro educativo (como string para compatibilidad JSON)
  readonly name: string; // El nombre del centro educativo
  readonly description?: string|null; // El nombre del centro educativo
  readonly createdAt: Date; // La fecha de creación
  readonly updatedAt: Date | null; // La fecha de la última actualización
  readonly deletedAt: Date | null; // La fecha de borrado lógico

  constructor(
    roleId: string,
    name: string,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    description?: string|null,
  ) {
    this.roleId = roleId;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    Object.freeze(this);
  }
}
