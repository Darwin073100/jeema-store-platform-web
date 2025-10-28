'use server'
import { EmployeeRepositoryFactory } from "../infraestructure/factories/employee-repository.factory";
import { FindEmployeeByIdUseCase } from "../application/use-cases/find-employee-by-id.use-case";

export async function findEmployeeByIdAction(employeeId: bigint){
    const userFetchRepositoryImpl = EmployeeRepositoryFactory.create();
    const useCase = new FindEmployeeByIdUseCase(userFetchRepositoryImpl);

    const result = await useCase.execute(employeeId);
    return {
        ...result
    }
}