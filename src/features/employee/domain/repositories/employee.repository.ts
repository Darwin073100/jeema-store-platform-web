import { Result } from "@/shared/features/result";
import { EmployeeEntity } from "../entities/employee.entity";
import { ErrorEntity } from "@/shared/features/error.entity";

export interface EmployeeRepository {
    findAllEmployeesByEstablishmentId(establishmentId: bigint): Promise<Result<{employees: EmployeeEntity[]}, ErrorEntity>>
}