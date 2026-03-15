import { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";
import { IUserRole } from "./IUserRole";

export interface IUser {
        userId: string;
        employeeId: string;
        username: string;
        email: string;
        passwordHash: string;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        userRoles: IUserRole[];
        employee: IEmployee | null;
        updatedAt: Date | null;
        deletedAt: Date | null;
}