import { DataSource, Repository } from "typeorm";
import { EmployeeOrmEntity } from "../entities/employee-orm-entity";
import { Injectable } from "@nestjs/common";import { EmployeeChekerPort } from "src/contexts/employee-management/employee/domain/ports/out/employee-checker.port";

@Injectable()
export class TypeormEmployeeCheckerAdapter implements EmployeeChekerPort {
    private readonly repository: Repository<EmployeeOrmEntity>
    
    constructor(private readonly datasource: DataSource){
        this.repository = this.datasource.getRepository(EmployeeOrmEntity);
    }
    /**
     * Verifica si un empleado existe en la base de datos.
     * @param employeeId El ID del empleado.
     * @returns True si el empleado existe, false en caso contrario.
     */
    async exists(employeeId: bigint): Promise<boolean> {
        const result = await this.repository.existsBy({ employeeId });
        return result;
    }
}