import { EmployeeRoleRepository } from "../../domain/repositories/employee-role.repository";

export class FindAllEmployeeRoleUseCase{
    constructor(
        private readonly repository: EmployeeRoleRepository
    ){}

    async execute(){
        const result = await this.repository.findAll();
        return result;
    }
}