import { BranchOfficeMapper } from "src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/mappers/branch-office.mapper";
import { EmployeeMapper } from "src/contexts/employee-management/employee/infraestruture/persistence/typeorm/mappers/employee.mapper";
import { SuplierMapper } from "src/contexts/purchase-management/suplier/infraestructure/persistence/typeorm/mappers/suplier.mapper";
import { AddressOrmEntity } from "../entities/address.orm-entity";
import { AddressEntity } from "../../domain/entities/address.entity";

export class AddressMapper {
    static toDomain(ormEntity: AddressOrmEntity): AddressEntity {
        const addressVo = AddressEntity.reconstitute(
            ormEntity.addressId,
            ormEntity.country,
            ormEntity.state,
            ormEntity.postalCode,
            ormEntity.municipality,
            ormEntity.city,
            ormEntity.street,
            ormEntity.externalNumber,
            ormEntity.internalNumber,
            ormEntity.neighborhood,
            ormEntity.reference,
            ormEntity.createdAt,
            ormEntity.updatedAt,
            ormEntity.deletedAt,
            ormEntity.branchOffice? BranchOfficeMapper.toDomainEntity(ormEntity.branchOffice): null,
            ormEntity.employee? EmployeeMapper.toDomainEntity(ormEntity.employee): null,
            ormEntity.suplier? SuplierMapper.toDomainEntity(ormEntity.suplier): null
        );
        return addressVo;
    }

    static toOrm(domainEntity: AddressEntity): AddressOrmEntity {
        const addressOrmEntity = new AddressOrmEntity();
        addressOrmEntity.addressId = domainEntity.addressId;
        addressOrmEntity.street = domainEntity.street;
        addressOrmEntity.externalNumber = domainEntity.externalNumber;
        addressOrmEntity.internalNumber = domainEntity.internalNumber;
        addressOrmEntity.municipality = domainEntity.municipality;
        addressOrmEntity.neighborhood = domainEntity.neighborhood;
        addressOrmEntity.city = domainEntity.city;
        addressOrmEntity.state = domainEntity.state;
        addressOrmEntity.postalCode = domainEntity.postalCode;
        addressOrmEntity.country = domainEntity.country;
        addressOrmEntity.reference = domainEntity.reference;
        addressOrmEntity.createdAt = domainEntity.createdAt;
        addressOrmEntity.updatedAt = domainEntity.updatedAt;
        addressOrmEntity.deletedAt = domainEntity.deletedAt;
        // No mapear relaciones aquí. TypeORM manejará las relaciones automáticamente
        // a través de las claves foráneas en las entidades relacionadas.
        // Mapear relaciones aquí causa que se actualicen con datos incompletos.
        return addressOrmEntity;
    }
}