import { RegisterAddress } from "src/shared/application/dtos/register-address.dto";

/**
 * RegisterBranchOfficeRequest define la estructura de los datos de entrada
 * necesarios para el caso de uso de registro de una sucursal.
 *
 * Es un DTO (Data Transfer Object) para la capa de Aplicación.
 */
export class RegisterSuplierDto {
    readonly establishmentId: bigint;
    readonly name: string;
    readonly phoneNumber: string | null;
    readonly rfc: string | null;
    readonly contactPerson: string | null;
    readonly email: string | null;
    readonly notes: string | null;
    readonly address: RegisterAddress | null;
    constructor(
        establishmentId: bigint,
        name: string,
        contactPerson: string | null,
        phoneNumber: string | null,
        email: string | null,
        rfc: string | null,
        notes: string | null,
        address: RegisterAddress | null,
    ){
        this.establishmentId = establishmentId;
        this.address = address;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.rfc = rfc;
        this.contactPerson = contactPerson;
        this.email = email;
        this.notes = notes;
    }
  }