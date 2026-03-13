import { DataSource, Repository } from "typeorm";
import { EmployeeRoleOrmEntity } from "../entities/employee-role-orm-entity";
import { Injectable } from "@nestjs/common";
import { EmployeeRoleChekerPort } from "src/contexts/employee-management/employee-role/domain/ports/out/employee-role-checker.port";

@Injectable()
export class TypeormEmployeeRoleCheckerAdapter implements EmployeeRoleChekerPort {
    private readonly repository: Repository<EmployeeRoleOrmEntity>
    
    constructor(private readonly datasource: DataSource){
        this.repository = this.datasource.getRepository(EmployeeRoleOrmEntity);
    }

    async exists(employeeRoleId: bigint): Promise<boolean> {
        // ...removed console.log...
        const result = await this.repository.existsBy({ employeeRoleId });
        // ...removed console.log...
        return result;
    }
}