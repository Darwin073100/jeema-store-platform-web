import { EmployeeMapper } from "src/contexts/employee-management/employee/application/mappers/employee.mapper";
import { BranchOfficeEntity } from "../../domain/entities/branch-office.entity";
import { BranchOfficeResponseDto } from "../dtos/branch-office-response.dto";
import { SaleMapper } from "src/contexts/sale-management/sale/application/mappers/sale-mapper";
import { IBranchOffice } from "../../presentation/interfaces/IBranchOffice";
import { AddressMapper } from "@/contexts/establishment-management/address/application/mappers/address.mapper";
import { EstablishmentMapper } from "@/contexts/establishment-management/establishment/application/mappers/establishment.mapper";

export class BranchOfficeMapper {
    public static toResponseDto(entity: BranchOfficeEntity): BranchOfficeResponseDto {
      return new BranchOfficeResponseDto(
        entity.branchOfficeId,
        entity.establishmentId,
        entity.name,
        AddressMapper.toResponseDTO(entity.address),
        entity.createdAt,
        entity.updatedAt,
        entity.deletedAt,
        entity.employees? entity.employees.map(item=> EmployeeMapper.toResponseDto(item)): null,
        entity.sales ? entity.sales.map(sale => SaleMapper.toResponseDto(sale)) : null
      );
    }
    public static toIResponse(entity: BranchOfficeEntity): IBranchOffice {
      const branch: IBranchOffice = {
        branchOfficeId: entity.branchOfficeId,
        establishmentId: entity.establishmentId,
        name: entity.name,
        address: AddressMapper.toIResponse(entity.address),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        deletedAt: entity.deletedAt,
        employees: entity.employees? entity.employees.map(item=> EmployeeMapper.toIResponse(item)): [],
        sales: entity.sales ? entity.sales.map(sale => SaleMapper.toIResponse(sale)) : [],
        establishment: entity.establishment? EstablishmentMapper.toIResponse(entity.establishment): null
      };
      return branch;
    }
}