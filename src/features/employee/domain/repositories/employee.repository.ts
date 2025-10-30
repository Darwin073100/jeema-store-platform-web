import { Result } from "@/shared/features/result";
import { EmployeeEntity } from "../entities/employee.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { EmployeeRoleEntity } from "../entities/employee-role.entity";
import { RegisterEmployeeDTO } from "../../application/dtos/register-employee.dto";
import { UpdateEmployeeDTO } from "../../application/dtos/update-employee.dto";

export interface EmployeeRepository {
    findAllEmployeesByEstablishmentId(establishmentId: bigint): Promise<Result<{employees: EmployeeEntity[]}, ErrorEntity>>;
    findAllEmployeeRoles(): Promise<Result<{ employeeRoles: EmployeeRoleEntity[] }, ErrorEntity>>;
    findById(employeeId: bigint): Promise<Result<EmployeeEntity, ErrorEntity>>;
    save(dto: RegisterEmployeeDTO): Promise<Result<EmployeeEntity, ErrorEntity>>;
    update(employeeId: bigint, dto: UpdateEmployeeDTO): Promise<Result<EmployeeEntity, ErrorEntity>>;
}