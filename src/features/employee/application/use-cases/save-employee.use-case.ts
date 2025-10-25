import { RegisterUserDTO } from "@/features/auth/application/dtos/register-user.dto";
import { EmployeeRepository } from "../../domain/repositories/employee.repository";
import { RegisterEmployeeDTO } from "../dtos/register-employee.dto";

export class SaveEmployeeUseCase{
    constructor(
        private readonly repository: EmployeeRepository,
    ){}

    async execute(employeeDto: RegisterEmployeeDTO, userDto: RegisterUserDTO | null){
        const result = await this.repository.save(employeeDto);
        return result;
    }
}