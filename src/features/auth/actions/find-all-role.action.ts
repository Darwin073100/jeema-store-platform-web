'use server'
import { FindAllRoleUseCase } from "../application/use-cases/find-all-role.use-case";
import { RoleRepositoryFactory } from "../infraestructure/factories/role-repository.factory";

export async function findAllRoleAction(){
    const repository = RoleRepositoryFactory.create();
    const useCase = new FindAllRoleUseCase(repository);

    const result = await useCase.execute();

    return{
        ...result
    };
}