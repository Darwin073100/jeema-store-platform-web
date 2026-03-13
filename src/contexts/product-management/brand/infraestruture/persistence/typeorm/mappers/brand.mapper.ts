import { BrandEntity } from "src/contexts/product-management/brand/domain/entities/brand.entity";
import { BrandOrmEntity } from "../entities/brand-orm-entity";
import { ProductTypeOrmMapper } from 'src/contexts/product-management/product/infraestructure/persistence/typeorm/mappers/product.mapper';
import { EstablishmentMapper } from "src/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/mappers/establishment.mapper";

export class BrandMapper{
    static toOrmEntity(domainEntity: BrandEntity){
        const ormEntity = new BrandOrmEntity();
        ormEntity.establishmentId = domainEntity.establishemntId;
        ormEntity.name = domainEntity.name;
        ormEntity.createdAt = domainEntity.createdAt;
        ormEntity.updatedAt = domainEntity.updatedAt;
        ormEntity.deletedAt = domainEntity.deletedAt;
        ormEntity.products = domainEntity.products? domainEntity.products.map(product => ProductTypeOrmMapper.toOrm(product)): null;
        ormEntity.establishment = domainEntity.establishment? EstablishmentMapper.toOrmEntity(domainEntity.establishment): null;
        return ormEntity;
    } 

    static toDomainEntity(ormEntity: BrandOrmEntity){
        return BrandEntity.reconstitute(
            ormEntity.brandId,
            ormEntity.establishmentId,
            ormEntity.name,
            ormEntity.createdAt,
            ormEntity.updatedAt,
            ormEntity.deletedAt,
            ormEntity.products ? ormEntity.products.map(productOrm => ProductTypeOrmMapper.toDomain(productOrm)) : null,
            ormEntity.establishment ? EstablishmentMapper.toDomainEntity(ormEntity.establishment): null,
        );
    }
}