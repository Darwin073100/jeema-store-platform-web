import { RoleCheckerPort } from "src/contexts/authentication-management/role/domain/ports/out/role-checker.port";
import { DataSource, Repository } from "typeorm";
import { RoleOrmEntity } from "../entities/role.orm-entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TypeormRoleCheckerAdapter implements RoleCheckerPort{
    private repository: Repository<RoleOrmEntity>;

    constructor(
        private readonly datasource: DataSource
    ){
        this.repository = this.datasource.getRepository(RoleOrmEntity);
    }

    async check(roleId: bigint): Promise<boolean> {
        const roleExist = await this.repository.exists({where: {roleId: roleId}})
        return roleExist;
    }
}