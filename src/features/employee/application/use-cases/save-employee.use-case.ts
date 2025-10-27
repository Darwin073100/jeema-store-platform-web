import { RegisterUserDTO } from "@/features/auth/application/dtos/register-user.dto";
import { EmployeeRepository } from "../../domain/repositories/employee.repository";
import { RegisterEmployeeDTO } from "../dtos/register-employee.dto";
import { Result } from "@/shared/features/result";
import { ErrorEntity } from "@/shared/features/error.entity";

export class SaveEmployeeUseCase{
    constructor(
        private readonly repository: EmployeeRepository,
    ){}

    async execute(employeeDto: RegisterEmployeeDTO, userDto: RegisterUserDTO | null){
        try {
            let currentEmployeeDTO = {
                ...employeeDto,
            }
            if(userDto){
                currentEmployeeDTO.user = userDto;
            }
            
            const result = await this.repository.save(currentEmployeeDTO);
            return result;
        } catch (error) {
            console.log(error);
            return Result.failure<ErrorEntity>({
                error: '500: ¡Error!',
                message: 'Error insperado',
                path: '/user',
                statusCode: 500,
                timestamp: new Date().toDateString()
            });
        }
    }
}