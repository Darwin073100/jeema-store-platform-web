import { RoleCheckerPort } from "src/contexts/authentication-management/role/domain/ports/out/role-checker.port";
import { DataSource, Repository } from "typeorm";
import { PermissionOrmEntity } from "../entities/permission.orm-entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TypeormPermissionCheckerAdapter implements RoleCheckerPort{
    private repository: Repository<PermissionOrmEntity>;

    constructor(
        private readonly datasource: DataSource
    ){
        this.repository = this.datasource.getRepository(PermissionOrmEntity);
    }

    async check(permissionId: bigint): Promise<boolean> {
        const permissionExist = await this.repository.exists({where: {permissionId: permissionId}})
        return permissionExist;
    }
}