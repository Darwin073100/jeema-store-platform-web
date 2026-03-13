import { EmployeeRoleEntity } from "src/contexts/employee-management/employee-role/domain/entities/employee-role.entity";
import { EmployeeRoleOrmEntity } from "../entities/employee-role-orm-entity";
import { EmployeeMapper } from 'src/contexts/employee-management/employee/infraestruture/persistence/typeorm/mappers/employee.mapper';
import { EmployeeRoleNameVO } from "src/contexts/employee-management/employee-role/domain/values-objects/employee-role-name.vo";

export class EmployeeRoleMapper{
    static toOrmEntity(domainEntity: EmployeeRoleEntity){
        const ormEntity = new EmployeeRoleOrmEntity();
        ormEntity.name = domainEntity.name.value;
        ormEntity.createdAt = domainEntity.createdAt;
        ormEntity.updatedAt = domainEntity.updatedAt;
        ormEntity.deletedAt = domainEntity.deletedAt;
        // Mapear empleados si existen
        if (domainEntity.employees) {
            ormEntity.employees = domainEntity.employees.map(item => EmployeeMapper.toOrmEntity(item));
        }
        return ormEntity;
    } 

    static toDomainEntity(ormEntity: EmployeeRoleOrmEntity){
        return EmployeeRoleEntity.reconstitute(
            ormEntity.employeeRoleId,
            EmployeeRoleNameVO.create(ormEntity.name),
            ormEntity.createdAt,
            ormEntity.updatedAt,
            ormEntity.deletedAt,
            ormEntity.employees ? ormEntity.employees.map(item => EmployeeMapper.toDomainEntity(item)) : undefined
        );
    }
}