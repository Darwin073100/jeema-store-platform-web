import { EmployeeRepository } from "../../domain/repositories/employee.repository";
import { Result } from "@/shared/features/result";
import { ErrorEntity } from "@/shared/features/error.entity";
import { UpdateEmployeeDTO } from "../dtos/update-employee.dto";

export class UpdateEmployeeUseCase{
    constructor(
        private readonly repository: EmployeeRepository,
    ){}

    async execute(employeeId: bigint, dto: UpdateEmployeeDTO){
        try {
            const result = await this.repository.update(employeeId, dto);
            return result;
        } catch (error) {
            return Result.failure<ErrorEntity>({
                error: '500: ¡Error!',
                message: 'use case - Error inesperado',
                path: '/employee',
                statusCode: 500,
                timestamp: new Date().toDateString()
            });
        }
    }
}