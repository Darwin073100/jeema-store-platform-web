'use server'
import { revalidatePath } from "next/cache";
import { UpdateEmployeeDto } from "../../application/dtos/update-employee.dto";
import { TypeOrmEmployeeRepository } from "../../infraestruture/persistence/typeorm/repositories/typeorm-employee.repository";
import { UpdateEmployeeUseCase } from "../../application/use-cases/update-employee.use-case";
import { TypeOrmEmployeeRoleRepository } from "@/contexts/employee-management/employee-role/infraestruture/persistence/typeorm/repositories/typeorm-employee-role.repository";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { Result } from "@/shared/lib/utils/result";
import { EmployeeMapper } from "../../application/mappers/employee.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

export async function updateEmployeeAction(employeeId: bigint, dto: UpdateEmployeeDto) {
    try {
        const employeeRepository = await TypeOrmEmployeeRepository.create();
        const employeeRoleRepository = await TypeOrmEmployeeRoleRepository.create();
        const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();
        const useCase = new UpdateEmployeeUseCase(employeeRepository, employeeRoleRepository, branchOfficeRepository);

        const result = await useCase.execute(employeeId, dto);

        revalidatePath('/configurations/employees');
        revalidatePath('/configurations/users');

        return {
            ...Result.success(EmployeeMapper.toIResponse(result))
        }
    } catch (error) {
        console.error('updateEmployeeAction', error)
        return {
            ...handleError(error, 'updateEmployeeAction')
        }
    }
}