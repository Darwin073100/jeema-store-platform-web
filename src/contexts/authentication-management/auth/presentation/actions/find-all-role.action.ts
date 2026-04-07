'use server'
import { RoleMapper } from "@/contexts/authentication-management/role/application/mappers/role.mapper";
import { FindAllRoleUseCase } from "@/contexts/authentication-management/role/application/use-cases/find-all-role.use-case";
import { TypeormRoleRepository } from "@/contexts/authentication-management/role/infraestructure/persistence/typeorm/repositories/typeorm-role.repository";
import { Result } from "@/shared/features/result";

export async function findAllRoleAction() {
    try {
        const repository = await TypeormRoleRepository.create();
        const useCase = new FindAllRoleUseCase(repository);

        const result = await useCase.execute();

        return {
            ...Result.success({ roles: result.map(item => RoleMapper.toIResponse(item)) })
        };
    } catch (error) {
        return {
            ...Result.success({ roles: [] })
        };

    }
}