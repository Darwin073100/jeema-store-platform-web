import { EmployeeRepository } from "../../domain/repositories/employee.repository";

export class FindEmployeeByIdUseCase{
    constructor(
        private readonly repository: EmployeeRepository,
    ){}

    async execute(employeeId: bigint){
        const result = await this.repository.findById(employeeId);
        return result;
    }
}