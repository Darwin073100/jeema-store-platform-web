import { BranchOfficeEntity } from "src/contexts/establishment-management/branch-office/domain/entities/branch-office.entity";
import { AddressEntity } from 'src/shared/domain/entities/address.entity';
import { BranchOfficeOrmEntity } from "../entities/branch-office.orm-entity";
import { SaleMapper } from "src/contexts/sale-management/sale/infraestructure/persistence/typeorm/mappers/sale.mapper";
import { EstablishmentMapper } from "src/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/mappers/establishment.mapper";
import { EmployeeMapper } from "src/contexts/employee-management/employee/infraestruture/persistence/typeorm/mappers/employee.mapper";
import { TransactionMapper } from "src/contexts/transaction-management/transaction/infraestructure/mappers/transaction.mapper";
import { AddressMapper } from "src/shared/infraestructure/mappers/address.mapper";
import { AddressOrmEntity } from 'src/shared/infraestructure/typeorm/address.orm-entity';
import { CashRegisterMapper } from "src/contexts/cash-management/cash-register/infraestructure/mappers/cash-register.mapper";

/**
 * BranchOfficeMapper es una clase que se encarga de transformar
 * entre la entidad de dominio BranchOffice y la entidad ORM BranchOfficeOrmEntity.
 * 
 * Este mapper es esencial para mantener la separación entre el dominio
 * y la capa de infraestructura, permitiendo que cada uno evolucione
 * de manera independiente.
 */
export class BranchOfficeMapper {
  public static toOrmEntity(domainEntity: BranchOfficeEntity): BranchOfficeOrmEntity {
    const ormEntity = new BranchOfficeOrmEntity();
    ormEntity.branchOfficeId = domainEntity.branchOfficeId;
    ormEntity.name = domainEntity.name;
    ormEntity.establishmentId = domainEntity.establishmentId;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    ormEntity.deletedAt = domainEntity.deletedAt;
    ormEntity.establishment = domainEntity.establishment ? EstablishmentMapper.toOrmEntity(domainEntity.establishment) : null;
    ormEntity.employees = domainEntity.employees ? domainEntity.employees.map(employee => EmployeeMapper.toOrmEntity(employee)) : null;
    ormEntity.transactions = domainEntity.transactions ? domainEntity.transactions.map(item => TransactionMapper.toOrm(item)) : null;
    ormEntity.cashRegisters = domainEntity.cashRegister ? domainEntity.cashRegister.map(item => CashRegisterMapper.toOrm(item)) : null;
    ormEntity.address = domainEntity.address ? (AddressMapper.toOrm(domainEntity.address) as unknown as AddressOrmEntity) : (null as unknown as AddressOrmEntity);
    if (domainEntity.addressId) {
      ormEntity.addressId = domainEntity.addressId;
    }
    ormEntity.sales = domainEntity.sales ? domainEntity.sales.map(sale => SaleMapper.toTypeOrmEntity(sale)) : null;

    return ormEntity;
  }

  public static toDomainEntity(ormEntity: BranchOfficeOrmEntity): BranchOfficeEntity {
    // Si la dirección está cargada en la relación, la mapeamos. Si no, reconstituimos una dirección mínima
    // usando el addressId para cumplir con la firma del constructor de BranchOfficeEntity.
    const addressDomain = ormEntity.address
      ? AddressMapper.toDomain(ormEntity.address)
      : AddressEntity.reconstitute(
        ormEntity.addressId,
        '', // country
        '', // state
        '', // postalCode
        '', // municipality
        '', // city
        null, // street
        null, // externalNumber
        null, // internalNumber
        null, // neighborhood
        null, // reference
        new Date(), // createdAt
        null, // updatedAt
        null, // deletedAt
        null, // branchOffice
        null, // employee
        null, // suplier
      );

    // Reconstituir la entidad de dominio
    return BranchOfficeEntity.reconstitute(
      ormEntity.branchOfficeId,
      ormEntity.establishmentId,
      ormEntity.addressId,
      ormEntity.name,
      addressDomain as unknown as AddressEntity,
      ormEntity.createdAt,
      ormEntity.updatedAt,
      ormEntity.deletedAt,
      ormEntity.establishment ? EstablishmentMapper.toDomainEntity(ormEntity.establishment) : null,
      ormEntity.sales ? ormEntity.sales.map(sale => SaleMapper.toDomainEntity(sale)) : null,
      ormEntity.transactions ? ormEntity.transactions.map(item => TransactionMapper.toDomain(item)) : null,
      ormEntity.employees ? ormEntity.employees.map(employee => EmployeeMapper.toDomainEntity(employee)) : null,
      ormEntity.cashRegisters ? ormEntity.cashRegisters.map(item => CashRegisterMapper.toDomain(item)) : null,
    );
  }
}
