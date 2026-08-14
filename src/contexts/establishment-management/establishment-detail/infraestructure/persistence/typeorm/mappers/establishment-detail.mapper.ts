import { EstablishmentDetailEntity } from "src/contexts/establishment-management/establishment-detail/domain/entities/establishment-detail.entity";
import { EstablishmentDetailOrmEntity } from "../entities/establishment-detail.orm-entity";

export class EstablishmentDetailMapper {
  static toOrmEntity(domainEntity: EstablishmentDetailEntity): EstablishmentDetailOrmEntity {
    const ormEntity = new EstablishmentDetailOrmEntity();
    ormEntity.establishmentDetailId = domainEntity.establishmentDetailId;
    ormEntity.establishmentId = domainEntity.establishmentId;
    ormEntity.type = domainEntity.type;
    ormEntity.value = domainEntity.value;
    ormEntity.sortOrder = domainEntity.sortOrder;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    ormEntity.deletedAt = domainEntity.deletedAt;
    return ormEntity;
  }

  static toDomainEntity(ormEntity: EstablishmentDetailOrmEntity): EstablishmentDetailEntity {
    return EstablishmentDetailEntity.reconstitute(
      ormEntity.establishmentDetailId,
      ormEntity.establishmentId,
      ormEntity.type,
      ormEntity.value,
      ormEntity.sortOrder,
      ormEntity.createdAt,
      ormEntity.updatedAt,
      ormEntity.deletedAt,
    );
  }
}
