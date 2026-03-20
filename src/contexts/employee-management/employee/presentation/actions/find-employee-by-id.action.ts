'use server'

import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { FindEmployeeByIdUseCase } from "../../application/use-cases/find-employee-by-id.use-case";
import { TypeOrmEmployeeRepository } from "../../infraestruture/persistence/typeorm/repositories/typeorm-employee.repository";
import { Result } from "@/shared/features/result";
import { EmployeeMapper } from "../../application/mappers/employee.mapper";
import { EmployeeNotFoundException } from "../../domain/exceptions/employee-not-found.exception";

export async function findEmployeeByIdAction(employeeId: bigint) {
    try {
        const userFetchRepositoryImpl = await TypeOrmEmployeeRepository.create();
        const useCase = new FindEmployeeByIdUseCase(userFetchRepositoryImpl);

        const result = await useCase.execute(employeeId);
        if(!result){
            throw new EmployeeNotFoundException('Empleado no encontrado.');
        }
        return {
            ...Result.success(EmployeeMapper.toIResponse(result))
        }
    } catch (error) {
        console.error('findEmployeeByIdAction: ', error);
        return {
            ...handleError(error, 'findEmployeeByIdAction')
        }
    }
}