import { EmployeeEntity } from "@/features/employee/domain/entities/employee.entity";
import { UserRoleEntity } from "./user-role.entity";

export interface UserEntity{
    userId: bigint;
    employeeId: bigint;
    username: string;
    email: string;
    passwordHash: string;
    isActive: boolean;
    lastLogin?: Date | null;
    createdAt: Date;
    userRoles?: UserRoleEntity[];
    employee?: EmployeeEntity|null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
}