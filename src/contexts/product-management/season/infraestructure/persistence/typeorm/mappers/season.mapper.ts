import { SeasonEntity } from "src/contexts/product-management/season/domain/entities/season.entity";
import { SeasonOrmEntity } from "../entities/season.orm-entity";
import { ProductTypeOrmMapper } from 'src/contexts/product-management/product/infraestructure/persistence/typeorm/mappers/product.mapper';
import { EstablishmentMapper } from "src/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/mappers/establishment.mapper";

export class SeasonMapper {
  static toOrmEntity(domainEntity: SeasonEntity): SeasonOrmEntity {
    const ormEntity = new SeasonOrmEntity();
    ormEntity.seasonId = domainEntity.seasonId;
    ormEntity.establishmentId = domainEntity.establishmentId;
    ormEntity.name = domainEntity.name;
    ormEntity.description = domainEntity.description ?? null;
    ormEntity.dateInit = domainEntity.dateInit;
    ormEntity.dateFinish = domainEntity.dateFinish;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    ormEntity.deletedAt = domainEntity.deletedAt;
    // Mapeo de entidades
    ormEntity.products = domainEntity.products? domainEntity.products.map(product => ProductTypeOrmMapper.toOrm(product)): null;
    ormEntity.establishment = domainEntity.establishment? EstablishmentMapper.toOrmEntity(domainEntity.establishment): null;
    return ormEntity;
  }

  static toDomainEntity(ormEntity: SeasonOrmEntity): SeasonEntity {
    return SeasonEntity.reconstitute(
      ormEntity.seasonId,
      ormEntity.establishmentId,
      ormEntity.name,
      ormEntity.description ?? null,
      ormEntity.dateInit ?? null,
      ormEntity.dateFinish ?? null,
      ormEntity.createdAt,
      ormEntity.updatedAt ?? null,
      ormEntity.deletedAt ?? null,
      ormEntity.products ? ormEntity.products.map(productOrm => ProductTypeOrmMapper.toDomain(productOrm)) : null,
      ormEntity.establishment? EstablishmentMapper.toDomainEntity(ormEntity.establishment): null,
    );
  }
}
