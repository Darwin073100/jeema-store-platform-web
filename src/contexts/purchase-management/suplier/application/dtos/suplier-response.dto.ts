import { AddressResponseDTO } from "src/shared/application/dtos/address-response.dto";

/**
 * RegisterBranchOfficeResponse define la estructura de los datos de salida
 * que retorna el caso de uso de registro de una sucursal.
 *
 * Es un DTO (Data Transfer Object) para la capa de Aplicación.
 */
export class SuplierResponseDto {
  readonly suplierId: bigint;
  readonly name: string;
  readonly phoneNumber: string | null;
  readonly rfc?: string | null;
  readonly contactPerson?: string | null;
  readonly email?: string | null;
  readonly notes?: string | null;
  readonly address: AddressResponseDTO | null;
  readonly createdAt: Date;
  readonly updatedAt?: Date | null;
  readonly deletedAt?: Date | null;
  constructor(
    suplierId: bigint,
    name: string,
    phoneNumber: string | null,
    address: AddressResponseDTO | null,
    createdAt: Date,
    rfc?: string | null,
    contactPerson?: string | null,
    email?: string | null,
    notes?: string | null,
    updatedAt?: Date | null,
    deletedAt?: Date | null,
  ) {
    this.suplierId = suplierId;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.rfc = rfc;
    this.contactPerson = contactPerson;
    this.email = email;
    this.notes = notes;
    this.address = address;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
