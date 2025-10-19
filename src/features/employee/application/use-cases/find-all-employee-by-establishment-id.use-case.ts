import { EmployeeRepository } from "../../domain/repositories/employee.repository";

export class FindAllEmployeesByEstablishmentIdUseCase{
    constructor(
        private readonly repository: EmployeeRepository,
    ){}

    async execute(establishmentId: bigint){
        const result = await this.repository.findAllEmployeesByEstablishmentId(establishmentId);
        return result;
    }
}