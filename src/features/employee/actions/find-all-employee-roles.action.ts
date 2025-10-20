'use server'
import { EmployeeRepositoryFactory } from "../infraestructure/factories/employee-repository.factory";
import { FindAllEmployeeRolesUseCase } from "../application/use-cases/find-all-employee-roles.use-case";

export async function findAllEmployeeRolesAction(){
    const userFetchRepositoryImpl = EmployeeRepositoryFactory.create();
    const useCase = new FindAllEmployeeRolesUseCase(userFetchRepositoryImpl);

    const result = await useCase.execute();
    return {
        ...result
    }
}