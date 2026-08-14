import { BranchOfficeResponseDto } from "src/contexts/establishment-management/branch-office/application/dtos/branch-office-response.dto";
import { EstablishmentDetailResponseDto } from "src/contexts/establishment-management/establishment-detail/application/dtos/establishment-detail-response.dto";

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
  readonly logoUrl: string | null; // El logotipo del establecimiento
  readonly createdAt: Date; // La fecha de creación
  readonly updatedAt: Date | null; // La fecha de la última actualización
  readonly deletedAt: Date | null; // La fecha de borrado lógico
  readonly branchOffices: BranchOfficeResponseDto[];
  readonly details: EstablishmentDetailResponseDto[];

  constructor(
    establishmentId: string,
    name: string,
    logoUrl: string | null,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    branchOffices: BranchOfficeResponseDto[],
    details: EstablishmentDetailResponseDto[],
  ) {
    this.establishmentId = establishmentId;
    this.name = name;
    this.logoUrl = logoUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.branchOffices = branchOffices;
    this.details = details;
    Object.freeze(this);
  }
}