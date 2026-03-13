import { RegisterAddress } from "@/contexts/establishment-management/address/application/dtos/register-address.dto";

/**
 * RegisterBranchOfficeRequest define la estructura de los datos de entrada
 * necesarios para el caso de uso de registro de una sucursal.
 *
 * Es un DTO (Data Transfer Object) para la capa de Aplicación.
 */
export class RegisterCustomerDto {
    readonly firstName: string;
    readonly saleDefault: boolean;
    readonly lastName?: string|null;
    readonly companyName?: string|null;
    readonly phoneNumber?: string|null;
    readonly rfc?: string | null;
    readonly email?: string | null;
    readonly customerType?: string | null;
    readonly address?: RegisterAddress|null;
    readonly establishmentId?: bigint|null;
    constructor(
        firstName: string,
        saleDefault: boolean,
        establishmentId?: bigint|null,
        lastName?: string|null,
        companyName?: string|null,
        phoneNumber?: string|null,
        address?: RegisterAddress|null,
        rfc?: string | null,
        email?: string | null,
        customerType?: string | null,
    ){
        this.saleDefault = saleDefault;
        this.establishmentId = establishmentId;
        this.address = address;
        this.firstName = firstName;
        this.lastName = lastName;
        this.companyName = companyName;
        this.phoneNumber = phoneNumber;
        this.rfc = rfc;
        this.email = email;
        this.customerType = customerType;
    }
  }