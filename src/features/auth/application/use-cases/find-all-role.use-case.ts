import { RoleRepository } from "../../domain/repositories/role.repository";

export class FindAllRoleUseCase{
    constructor(
        private readonly repository: RoleRepository,
    ){}

    async execute(){
        const result = await this.repository.findAllRole();
        return result;
    }
}