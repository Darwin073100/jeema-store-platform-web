import { BranchOfficeResponseDto } from "src/contexts/establishment-management/branch-office/application/dtos/branch-office-response.dto";

/**
 * Establishment ResponseDto es un Data Transfer Object (DTO)
 * que define la estructura de los datos que se enviarán como respuesta
 * a la capa de presentación después de una operación relacionada con
 * un Establishment  (ej. creación, consulta).
 *
 * Contiene solo los datos de salida relevantes, mapeados desde la entidad de dominio.
 */
export class EstablishmentResponseDto {
  readonly establishmentId: string; // El ID del establesimiento (como string para compatibilidad JSON)
  readonly name: string; // El nombre del establesimiento
  readonly createdAt: Date; // La fecha de creación
  readonly updatedAt: Date | null; // La fecha de la última actualización
  readonly deletedAt: Date | null; // La fecha de borrado lógico
  readonly branchOffices: BranchOfficeResponseDto[];

  constructor(
    establishmentId: string,
    name: string,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    branchOffices: BranchOfficeResponseDto[],
  ) {
    this.establishmentId = establishmentId;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.branchOffices = branchOffices;
    Object.freeze(this);
  }
}