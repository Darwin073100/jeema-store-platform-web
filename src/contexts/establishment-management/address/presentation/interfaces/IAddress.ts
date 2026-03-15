import { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";

export interface IAddress {
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
    branchOffice: IBranchOffice | null;
    employee: IEmployee | null
}