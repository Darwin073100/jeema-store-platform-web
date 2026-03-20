'use server'
import { EmployeeRepositoryFactory } from "../../../../../features/employee/infraestructure/factories/employee-repository.factory";
import { UpdateEmployeeDTO } from "../../../../../features/employee/application/dtos/update-employee.dto";
import { UpdateEmployeeUseCase } from "../../../../../features/employee/application/use-cases/update-employee.use-case";
import { revalidatePath } from "next/cache";

export async function updateEmployeeAction(employeeId: bigint, dto: UpdateEmployeeDTO){
    const employeeFetchRepositoryImpl = EmployeeRepositoryFactory.create();
    const useCase = new UpdateEmployeeUseCase(employeeFetchRepositoryImpl);

    const result = await useCase.execute(employeeId, dto);
    if(result.ok){
        revalidatePath('/configurations/employees');
        revalidatePath('/configurations/users');
    }
    return {
        ...result
    }

}