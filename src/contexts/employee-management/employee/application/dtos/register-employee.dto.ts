import { RegisterAddress } from "@/contexts/establishment-management/address/application/dtos/register-address.dto";

/**
 * RegisterEducationalCenterDto es un Data Transfer Object (DTO)
 * que define la estructura de los datos de entrada para el caso de uso
 * de registro de un establesimiento.
 *
 * Contiene solo los datos necesarios para la operación, sin lógica de negocio.
 */
export interface RegisterEmployeeDto {
  readonly branchOfficeId: bigint;
  readonly employeeRoleId: bigint;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string | null;
  readonly phoneNumber: string;
  readonly birthDate: string | null;
  readonly gender: string | null;
  readonly hireDate: string;
  readonly terminationDate: string | null;
  readonly entryTime: string | null;
  readonly exitTime: string | null;
  readonly currentSalary: number;
  readonly isActive: boolean;
  readonly photoUrl: string | null;
  readonly address: RegisterAddress | null;
}