import { EmployeeEntity } from "./employee.entity";

export interface EmployeeRoleEntity {
    employeeRoleId: bigint,
    name: string,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    employees: EmployeeEntity[]
}