import { Result } from "@/shared/features/result";
import { EmployeeEntity } from "../entities/employee.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { EmployeeRoleEntity } from "../entities/employee-role.entity";

export interface EmployeeRepository {
    findAllEmployeesByEstablishmentId(establishmentId: bigint): Promise<Result<{employees: EmployeeEntity[]}, ErrorEntity>>
    findAllEmployeeRoles(): Promise<Result<{ employeeRoles: EmployeeRoleEntity[] }, ErrorEntity>>
}