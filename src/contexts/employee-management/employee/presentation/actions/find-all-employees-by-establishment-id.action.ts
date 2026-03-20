'use server'
import { cookies } from "next/headers";
import { unstable_noStore as noStore } from 'next/cache';
import { TypeOrmEmployeeRepository } from "../../infraestruture/persistence/typeorm/repositories/typeorm-employee.repository";
import { FindAllEmployeeByEstablishmentIdUseCase } from "../../application/use-cases/find-all-employee-by-establishment-id.use-case";
import { IEstablishment } from "@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment";
import { Result } from "@/shared/features/result";
import { EmployeeMapper } from "../../application/mappers/employee.mapper";
import { EmployeeNotFoundException } from "../../domain/exceptions/employee-not-found.exception";

export async function findAllEmployeesByEstablishmentIdAction() {
    noStore(); // Evitar que se cachée este server action
    try {
        const employeeRepository = await TypeOrmEmployeeRepository.create();
        const useCase = new FindAllEmployeeByEstablishmentIdUseCase(employeeRepository);

        const cookieStore = await cookies();
        let establishment;

        if (cookieStore.has('establishmentCookie')) {
            establishment = cookieStore.get('establishmentCookie')?.value ?? null;
            if (establishment) {
                establishment = JSON.parse(establishment) as IEstablishment;
                const result = await useCase.execute(establishment.establishmentId);
                return {
                    ...Result.success({employees: result.map(item => EmployeeMapper.toIResponse(item))})
                }
            }
        } else {
            throw new EmployeeNotFoundException('No se encontraron empleados.');
        }
    } catch (error) {
        console.error('findAllEmployeesByEstablishmentIdAction', error);
        return {
            ...Result.success({employees: []})
        }
    }
}