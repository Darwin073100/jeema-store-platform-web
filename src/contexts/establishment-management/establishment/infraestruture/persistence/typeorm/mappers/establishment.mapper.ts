import { EstablishmentEntity } from "src/contexts/establishment-management/establishment/domain/entities/establishment.entity";
import { EstablishmentOrmEntity } from "../entities/establishment-orm-entity";
import { ProductTypeOrmMapper } from 'src/contexts/product-management/product/infraestructure/persistence/typeorm/mappers/product.mapper';
import { CustomerMapper } from "src/contexts/sale-management/customer/infraestructure/persistence/typeorm/mappers/customer.mapper";
import { BranchOfficeMapper } from "src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/mappers/branch-office.mapper";
import { SuplierMapper } from "src/contexts/purchase-management/suplier/infraestructure/persistence/typeorm/mappers/suplier.mapper";

export class EstablishmentMapper{
    static toOrmEntity(domainEntity: EstablishmentEntity){
        const ormEntity = new EstablishmentOrmEntity();
        ormEntity.name = domainEntity.name;
        ormEntity.createdAt = domainEntity.createdAt;
        ormEntity.updatedAt = domainEntity.updatedAt;
        ormEntity.deletedAt = domainEntity.deletedAt;
        ormEntity.branchOffices = domainEntity.branchOffices? domainEntity.branchOffices.map(item => BranchOfficeMapper.toOrmEntity(item)): null;
        ormEntity.products = domainEntity.products? domainEntity.products.map(product => ProductTypeOrmMapper.toOrm(product)): null;
        ormEntity.customers = domainEntity.customers? domainEntity.customers?.map(item => CustomerMapper.toOrmEntity(item)): null;
        ormEntity.supliers = domainEntity.supliers? domainEntity.supliers.map(item=> SuplierMapper.toOrmEntity(item)): null;
        return ormEntity;
    } 

    static toDomainEntity(ormEntity: EstablishmentOrmEntity){
        return EstablishmentEntity.reconstitute(
            ormEntity.establishmentId,
            ormEntity.name,
            ormEntity.createdAt,
            ormEntity.updatedAt,
            ormEntity.deletedAt,
            ormEntity.branchOffices? ormEntity.branchOffices.map(item => BranchOfficeMapper.toDomainEntity(item)): null,
            ormEntity.products ? ormEntity.products.map(productOrm => ProductTypeOrmMapper.toDomain(productOrm)) : null,
            ormEntity.customers ? ormEntity.customers.map(item => CustomerMapper.toDomainEntity(item)): null,
            ormEntity.supliers? ormEntity.supliers.map(item => SuplierMapper.toDomainEntity(item)): null,
        );
    }
}