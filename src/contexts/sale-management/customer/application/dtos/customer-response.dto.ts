import { AddressResponseDTO } from "src/contexts/establishment-management/address/application/dtos/address-response.dto";
import { EstablishmentResponseDto } from "src/contexts/establishment-management/establishment/application/dtos/establishment-response.dto";
import { SaleResponseDto } from "src/contexts/sale-management/sale/application/dtos/sale-response.dto";

/**
 * RegisterBranchOfficeResponse define la estructura de los datos de salida
 * que retorna el caso de uso de registro de una sucursal.
 *
 * Es un DTO (Data Transfer Object) para la capa de Aplicación.
 */
export class CustomerResponseDto {
  readonly customerId    : bigint;
  readonly addressId?    : bigint|null;
  readonly establishmentId?    : bigint|null;
  readonly firstName     : string;
  readonly saleDefault: boolean;
  readonly lastName?     : string|null;
  readonly companyName?  : string|null;
  readonly phoneNumber?  : string|null;
  readonly rfc?          : string | null;
  readonly email?        : string | null;
  readonly customerType? : string | null;
  readonly address?: AddressResponseDTO |null;
  readonly createdAt  : Date;
  readonly updatedAt? : Date | null;
  readonly deletedAt? : Date | null;
  readonly establishment?: EstablishmentResponseDto | null;
  readonly sales?: SaleResponseDto[];
  constructor(
    customerId       : bigint,
    createdAt        : Date,
    firstName        : string,
    saleDefault: boolean,
    establishmentId? : bigint|null,
    lastName?        : string|null,
    companyName?     : string|null,
    addressId?       : bigint|null,
    phoneNumber?     : string|null,
    address?: AddressResponseDTO|null,
    rfc?           : string | null,
    email?         : string | null,
    customerType?  : string | null,
    updatedAt?     : Date | null,
    deletedAt?     : Date | null,
    establishment? : EstablishmentResponseDto | null,
    sales?         : SaleResponseDto[],
  ) {
    this.saleDefault = saleDefault;
    this.establishmentId = establishmentId;
    this.addressId       = addressId;
    this.firstName       = firstName;
    this.lastName        = lastName;
    this.companyName     = companyName;
    this.customerId      = customerId;
    this.phoneNumber     = phoneNumber;
    this.rfc             = rfc;
    this.email           = email;
    this.customerType    = customerType;
    this.address         = address;
    this.createdAt       = createdAt;
    this.updatedAt       = updatedAt;
    this.deletedAt       = deletedAt;
    this.establishment   = establishment;
    this.sales           = sales;
  }
}
