import { EmployeeMapper } from "src/contexts/employee-management/employee/application/mappers/employee.mapper";
import { BranchOfficeEntity } from "../../domain/entities/branch-office.entity";
import { BranchOfficeResponseDto } from "../dtos/branch-office-response.dto";
import { SaleMapper } from "src/contexts/sale-management/sale/application/mappers/sale-mapper";
import { AddressMapper } from "src/shared/application/mappers/address.mapper";

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
}