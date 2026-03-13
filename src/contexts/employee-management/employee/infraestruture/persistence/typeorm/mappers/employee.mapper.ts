import { EmployeeEntity } from "src/contexts/employee-management/employee/domain/entities/employee.entity";
import { EmployeeOrmEntity } from "../entities/employee-orm-entity";
import { GenderEnum } from "src/contexts/employee-management/employee/domain/enums/gender.enum";
import { BranchOfficeMapper } from "src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/mappers/branch-office.mapper";
import { EmployeeRoleMapper } from "src/contexts/employee-management/employee-role/infraestruture/persistence/typeorm/mappers/employee-role.mapper";
import { SaleMapper } from "src/contexts/sale-management/sale/infraestructure/persistence/typeorm/mappers/sale.mapper";
import { TransactionMapper } from "src/contexts/transaction-management/transaction/infraestructure/mappers/transaction.mapper";
import { AddressMapper } from "src/shared/infraestructure/mappers/address.mapper";
import { UserMapper } from "src/contexts/authentication-management/auth/infraestructure/mappers/user.mapper";
import { CashSessionMapper } from "src/contexts/cash-management/cash-session/infraestructure/mappers/cash-session.mapper";
import { ReturnsMapper } from "src/contexts/sale-management/returns/infraestructure/mappers/returns.mapper";

export class EmployeeMapper {
  static toOrmEntity(domainEntity: EmployeeEntity): EmployeeOrmEntity {
    const orm = new EmployeeOrmEntity();
    orm.employeeId = domainEntity.employeeId;
    orm.branchOfficeId = domainEntity.branchOfficeId;
    orm.employeeRoleId = domainEntity.employeeRoleId;
    orm.addressId = domainEntity.addressId;
    orm.branchOffice = domainEntity.branchOffice ? BranchOfficeMapper.toOrmEntity(domainEntity.branchOffice) : null;
    orm.employeeRole = domainEntity.employeeRole ? EmployeeRoleMapper.toOrmEntity(domainEntity.employeeRole) : null;
    orm.address = domainEntity.address ? AddressMapper.toOrm(domainEntity.address) : null;
    orm.firstName = domainEntity.firstName;
    orm.lastName = domainEntity.lastName;
    orm.email = domainEntity.email;
    orm.phoneNumber = domainEntity.phoneNumber;
    orm.birthDate = domainEntity.birthDate;
    orm.gender = domainEntity.gender;
    orm.hireDate = domainEntity.hireDate;
    orm.terminationDate = domainEntity.terminationDate;
    orm.entryTime = domainEntity.entryTime;
    orm.exitTime = domainEntity.exitTime;
    orm.currentSalary = domainEntity.currentSalary;
    orm.isActive = domainEntity.isActive;
    orm.photoUrl = domainEntity.photoUrl;
    orm.createdAt = domainEntity.createdAt;
    orm.updatedAt = domainEntity.updatedAt;
    orm.deletedAt = domainEntity.deletedAt;
    orm.sales = domainEntity.sales ? domainEntity.sales.map(sale => SaleMapper.toTypeOrmEntity(sale)) : null;
    orm.transactions = domainEntity.transactions?.map( item => TransactionMapper.toOrm(item)) ?? null;
    orm.user = domainEntity.user? UserMapper.toOrmEntity(domainEntity.user): null;
    orm.cashSessions = domainEntity.cashSessions? domainEntity.cashSessions?.map(item=> CashSessionMapper.toOrm(item)): null;
    orm.returns = domainEntity.returns ? domainEntity.returns.map( item => ReturnsMapper.toOrm(item) ) : null;
    return orm;
  }

  static toDomainEntity(orm: EmployeeOrmEntity): EmployeeEntity {
    return EmployeeEntity.reconstitute(
      orm.employeeId,
      orm.employeeRoleId,
      orm.branchOfficeId,
      orm.addressId,
      orm.firstName,
      orm.lastName,
      orm.phoneNumber,
      orm.email,
      orm.birthDate,
      orm.gender ?? GenderEnum.OTHER,
      orm.hireDate,
      orm.terminationDate,
      orm.entryTime,
      orm.exitTime,
      orm.isActive,
      orm.photoUrl,
      orm.currentSalary,
      orm.createdAt,
      orm.updatedAt,
      orm.deletedAt,
      orm.employeeRole ? EmployeeRoleMapper.toDomainEntity(orm.employeeRole) : null,
      orm.branchOffice ? BranchOfficeMapper.toDomainEntity(orm.branchOffice) : null,
      orm.address ? AddressMapper.toDomain(orm.address) : null,
      orm.user ? UserMapper.toDomain(orm.user): null,
      orm.sales ? orm.sales.map(sale => SaleMapper.toDomainEntity(sale)) : null,
      orm.transactions? orm.transactions.map( item => TransactionMapper.toDomain(item)): null,
      orm.cashSessions ? orm.cashSessions.map(item => CashSessionMapper.toDomain(item)): null,
      orm.returns ? orm.returns.map( item => ReturnsMapper.toDomain(item) ) : null,
    );
  }
}