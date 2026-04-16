import { SuplierOrmEntity } from "../entities/suplier.orm-entity";
import { SuplierEntity } from "src/contexts/purchase-management/suplier/domain/entities/suplier.entity";
import { LotMapper } from "src/contexts/purchase-management/lot/infraestructura/persistence/typeorm/mappers/lot.mapper";
import { EstablishmentMapper } from "src/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/mappers/establishment.mapper";
import { AddressMapper } from "@/contexts/establishment-management/address/infraestructure/mappers/address.mapper";

export class SuplierMapper {
  /**
   * Convierte una entidad de dominio Suplier a una entidad ORM SuplierOrmEntity.
   * 
   * @param domainEntity La entidad de dominio Suplier a mapear.
   * @returns Una instancia de SuplierOrmEntity.
   */
  public static toOrmEntity(domainEntity: SuplierEntity): SuplierOrmEntity {
    const ormEntity = new SuplierOrmEntity();
    ormEntity.suplierId = domainEntity.suplierId;
    ormEntity.establishmentId = domainEntity.establishmentId;
    ormEntity.addressId = domainEntity.addressId;
    ormEntity.name = domainEntity.name;
    ormEntity.phoneNumber = domainEntity.phoneNumber;
    ormEntity.contactPerson = domainEntity.contactPerson;
    ormEntity.rfc = domainEntity.rfc;
    ormEntity.email = domainEntity.email;
    ormEntity.notes = domainEntity.notes;
    ormEntity.address = domainEntity.address? AddressMapper.toOrm(domainEntity.address): null;
    ormEntity.lots = domainEntity.lots ? domainEntity.lots.map(item => LotMapper.toOrm(item)): null;
    ormEntity.establishment = domainEntity.establishment? EstablishmentMapper.toOrmEntity(domainEntity.establishment): null;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    ormEntity.deletedAt = domainEntity.deletedAt;
    return ormEntity;
  }

  /**
   * Convierte una entidad ORM SuplierOrmEntity a una entidad de dominio Suplier.
   * 
   * @param ormEntity La entidad ORM SuplierOrmEntity a mapear.
   * @returns Una instancia de Suplier.
   */
  public static toDomainEntity(ormEntity: SuplierOrmEntity): SuplierEntity {
    // Reconstituir la entidad de dominio
    return SuplierEntity.reconstitute(
      ormEntity.suplierId,
      ormEntity.establishmentId,
      ormEntity.addressId,
      ormEntity.name,
      ormEntity.contactPerson,
      ormEntity.phoneNumber,
      ormEntity.email,
      ormEntity.rfc,
      ormEntity.notes,
      ormEntity.address? AddressMapper.toDomain(ormEntity.address): null,
      ormEntity.lots? ormEntity.lots.map(item => LotMapper.toDomain(item)): null,
      ormEntity.establishment? EstablishmentMapper.toDomainEntity(ormEntity.establishment): null,
      ormEntity.createdAt,
      ormEntity.updatedAt,
      ormEntity.deletedAt
    );
  }
}
