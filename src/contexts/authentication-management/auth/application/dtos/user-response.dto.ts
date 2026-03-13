import { EmployeeResponseDto } from "src/contexts/employee-management/employee/application/dtos/employee-response.dto";
import { UserRoleResponseDTO } from "./user-role-response.dto";

export class UserResponseDTO{
        userId: string;
        employeeId: string;
        username: string;
        email: string;
        passwordHash: string;
        isActive: boolean = true;
        lastLogin?: Date | null;
        createdAt: Date = new Date();
        userRoles?: UserRoleResponseDTO[];
        employee?: EmployeeResponseDto|null;
        updatedAt?: Date | null;
        deletedAt?: Date | null;
}