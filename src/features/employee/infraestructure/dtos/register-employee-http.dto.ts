import { RegisterUserHttpDTO } from "@/features/auth/infraestructure/dtos/register-user-http.dto";
import { RegisterAddressHttpDTO } from "@/shared/infrastructure/http/address/dtos/register-address-http.dto";

export interface RegisterEmployeeHttpDTO{
    branchOfficeId: string;
    employeeRoleId: string;
    firstName: string;
    lastName: string;
    email: string | undefined;
    phoneNumber: string;
    birthDate: string | undefined;
    gender: string | undefined;
    hireDate: string;
    terminationDate: string | undefined;
    entryTime: string | undefined;
    exitTime: string | undefined;
    currentSalary: number;
    isActive: boolean;
    photoUrl: string | undefined;
    address: RegisterAddressHttpDTO | undefined;
    user: RegisterUserHttpDTO | undefined;
}