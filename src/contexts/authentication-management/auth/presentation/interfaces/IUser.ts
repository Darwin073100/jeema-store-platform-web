import type { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";
import type { IUserRole } from "./IUserRole";

export interface IUser {
        userId: bigint;
        employeeId: bigint;
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