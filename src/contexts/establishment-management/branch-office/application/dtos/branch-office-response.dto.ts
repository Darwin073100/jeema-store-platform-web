import { EmployeeResponseDto } from "src/contexts/employee-management/employee/application/dtos/employee-response.dto";
import { SaleResponseDto } from "src/contexts/sale-management/sale/application/dtos/sale-response.dto";
import { AddressResponseDTO } from "src/shared/application/dtos/address-response.dto";

/**
 * RegisterBranchOfficeResponse define la estructura de los datos de salida
 * que retorna el caso de uso de registro de una sucursal.
 *
 * Es un DTO (Data Transfer Object) para la capa de Aplicación.
 */
export class BranchOfficeResponseDto {
  readonly branchOfficeId: bigint;
  readonly establishmentId: bigint;
  readonly name: string;
  readonly address: AddressResponseDTO;
  readonly createdAt: Date;
  readonly updatedAt?: Date | null;
  readonly deletedAt?: Date | null;
  readonly employees?: EmployeeResponseDto[] | null;
  readonly sales?: SaleResponseDto[] | null;
  constructor(
    branchOfficeId: bigint,
    establishmentId: bigint,
    name: string,
    address: AddressResponseDTO,
    createdAt: Date,
    updatedAt?: Date | null,
    deletedAt?: Date | null,
    employees?: EmployeeResponseDto[] | null,
    sales?: SaleResponseDto[] | null
  ) {
    this.branchOfficeId = branchOfficeId;
    this.establishmentId = establishmentId;
    this.name = name;
    this.address = address;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.employees = employees;
    this.sales = sales;
  }
}
