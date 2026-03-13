import { CategoryEntity } from "src/contexts/product-management/category/domain/entities/category-entity";
import { CategoryOrmEntity } from "../entities/category.orm-entity";
import { ProductTypeOrmMapper } from 'src/contexts/product-management/product/infraestructure/persistence/typeorm/mappers/product.mapper';
import { EstablishmentMapper } from "src/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/mappers/establishment.mapper";

export class CategoryMapper {
    // Domain to TypeORM
    static toTypeOrmEntity(domainEntity: CategoryEntity): CategoryOrmEntity {
        const typeOrmEntity = new CategoryOrmEntity();
        typeOrmEntity.categoryId = domainEntity.categoryId;
        typeOrmEntity.establishmentId = domainEntity.establishmentId;
        typeOrmEntity.name = domainEntity.name;
        typeOrmEntity.description = domainEntity.description;
        typeOrmEntity.createdAt = domainEntity.createdAt;
        typeOrmEntity.updatedAt = domainEntity.updatedAt;
        typeOrmEntity.products = domainEntity.products? domainEntity.products.map(product => ProductTypeOrmMapper.toOrm(product)): null;
        typeOrmEntity.establishment = domainEntity.establishment? EstablishmentMapper.toOrmEntity(domainEntity.establishment): null;
        return typeOrmEntity;
    }

    // TypeORM to Domain
    static toDomainEntity(typeOrmEntity: CategoryOrmEntity): CategoryEntity {
        return CategoryEntity.reconstitute(
            typeOrmEntity.categoryId,
            typeOrmEntity.establishmentId,
            typeOrmEntity.name,
            typeOrmEntity.description,
            typeOrmEntity.createdAt,
            typeOrmEntity.updatedAt,
            typeOrmEntity.deletedAt,
            typeOrmEntity.products ? typeOrmEntity.products.map(productOrm => ProductTypeOrmMapper.toDomain(productOrm)) : null,
            typeOrmEntity.establishment? EstablishmentMapper.toDomainEntity(typeOrmEntity.establishment) : null,
        );
    }
}