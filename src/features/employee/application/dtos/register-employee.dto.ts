import { RegisterUserDTO } from "@/features/auth/application/dtos/register-user.dto";
import { RegisterAddressDTO } from "@/shared/application/dtos/register-address.dto";

export interface RegisterEmployeeDTO{
    branchOfficeId: bigint;
    employeeRoleId: bigint;
    firstName: string;
    lastName: string;
    email: string | null;
    phoneNumber: string;
    birthDate: Date | null;
    gender: string | null;
    hireDate: Date;
    terminationDate: Date | null;
    entryTime: string | null;
    exitTime: string | null;
    currentSalary: number;
    isActive: boolean;
    photoUrl: string | null;
    address: RegisterAddressDTO | null;
    user: RegisterUserDTO | null;
}