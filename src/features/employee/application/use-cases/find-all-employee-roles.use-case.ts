import { EmployeeRepository } from "../../domain/repositories/employee.repository";

export class FindAllEmployeeRolesUseCase{
    constructor(
        private readonly repository: EmployeeRepository,
    ){}

    async execute(){
        const result = await this.repository.findAllEmployeeRoles();
        return result;
    }
}