/**
 * RegisterBranchOfficeRequest define la estructura de los datos de entrada
 * necesarios para el caso de uso de registro de una sucursal.
 *
 * Es un DTO (Data Transfer Object) para la capa de Aplicación.
 */
export interface RegisterBranchOfficeDto {
    readonly name: string;
    readonly address: {
      street: string | null;
      externalNumber: string | null;
      internalNumber: string | null;
      municipality: string;
      neighborhood: string | null;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      reference: string|null;
    };
    readonly establishmentId: bigint;
  }