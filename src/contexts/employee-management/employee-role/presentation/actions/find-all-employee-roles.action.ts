'use server'
import { EmployeeRoleMapper } from '@/contexts/employee-management/employee-role/application/mappers/employee-role.mapper';
import { FindAllEmployeeRoleUseCase } from '@/contexts/employee-management/employee-role/application/use-cases/find-all-employee-role.use-case';
import { TypeOrmEmployeeRoleRepository } from '@/contexts/employee-management/employee-role/infraestruture/persistence/typeorm/repositories/typeorm-employee-role.repository';
import { Result } from '@/shared/features/result';
import { unstable_noStore as noStore } from 'next/cache';

export async function findAllEmployeeRolesAction() {
    try {
        noStore(); // Evitar que se cachée este server action
        const userFetchRepositoryImpl = await TypeOrmEmployeeRoleRepository.create();
        const useCase = new FindAllEmployeeRoleUseCase(userFetchRepositoryImpl);

        const result = await useCase.execute();
        return {
            ...Result.success({ employeeRoles: result.map(item => EmployeeRoleMapper.toIResponse(item)) })
        }
    }catch(error){
        console.error('findAllEmployeeRolesAction: ', error);
        return {
            ...Result.success({ employeeRoles: [] })
        }
    }
}