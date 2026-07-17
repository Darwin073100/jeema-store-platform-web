import type { IEmployeeRole } from "@/contexts/employee-management/employee-role/presentation/interfaces/IEmployeeRole";
import type { IAddress } from "@/contexts/establishment-management/address/presentation/interfaces/IAddress";
import type { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";

export interface IEmployee {
    employeeId: bigint,
    branchOfficeId: bigint,
    employeeRoleId: bigint,
    addressId: bigint | null,
    firstName: string,
    lastName: string,
    email: string | null,
    createdAt: Date,
    phoneNumber: string | null,
    birthDate: Date | null,
    gender: string | null,
    hireDate: Date|null,
    terminationDate: Date | null,
    entryTime: string | null,
    exitTime: string | null,
    currentSalary: number | null,
    isActive: boolean,
    photoUrl: string | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
    employeeRole: IEmployeeRole | null,
    address: IAddress | null,
    user: any | null,
    branchOffice: IBranchOffice | null
}