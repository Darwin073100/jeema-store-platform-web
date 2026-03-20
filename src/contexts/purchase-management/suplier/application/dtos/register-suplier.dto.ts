import { RegisterAddress } from "@/contexts/establishment-management/address/application/dtos/register-address.dto";

/**
 * RegisterBranchOfficeRequest define la estructura de los datos de entrada
 * necesarios para el caso de uso de registro de una sucursal.
 *
 * Es un DTO (Data Transfer Object) para la capa de Aplicación.
 */
export interface RegisterSuplierDto {
    readonly establishmentId: bigint;
    readonly name: string;
    readonly phoneNumber: string | null;
    readonly rfc: string | null;
    readonly contactPerson: string | null;
    readonly email: string | null;
    readonly notes: string | null;
    readonly address: RegisterAddress | null;
  }