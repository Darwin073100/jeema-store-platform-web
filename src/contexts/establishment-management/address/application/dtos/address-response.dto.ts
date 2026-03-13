import { EmployeeResponseDto } from "src/contexts/employee-management/employee/application/dtos/employee-response.dto";
import { BranchOfficeResponseDto } from "src/contexts/establishment-management/branch-office/application/dtos/branch-office-response.dto";

export class AddressResponseDTO {
    addressId: bigint;
    street: string | null; // Calle // Juan ruiz de alarcon
    externalNumber: string | null; // Número exterior // 23
    internalNumber: string | null; // Número Interior Opcional //SN
    neighborhood: string | null; // Colonia
    municipality: string; // Municipio
    city: string; // Ciudad //Ometepec
    state: string; // Estado // Guerrero
    postalCode: string; // Código Postal // 41700
    country: string; // País // México
    reference: string|null; // Referencia //
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    branchOffice: BranchOfficeResponseDto | null;
    employee: EmployeeResponseDto | null
}