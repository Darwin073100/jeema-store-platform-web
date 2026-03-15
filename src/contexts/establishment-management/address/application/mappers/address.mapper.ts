import { AddressResponseDTO } from "../dtos/address-response.dto";
import { BranchOfficeMapper } from "src/contexts/establishment-management/branch-office/application/mappers/branch-office.mapper";
import { EmployeeMapper } from "src/contexts/employee-management/employee/application/mappers/employee.mapper";
import { AddressEntity } from "../../domain/entities/address.entity";
import { IAddress } from "../../presentation/interfaces/IAddress";

export class AddressMapper{
    public static toResponseDTO(entity: AddressEntity){
        const dto: AddressResponseDTO = {
            addressId: entity.addressId,
            country: entity.country,
            state: entity.state,
            postalCode: entity.postalCode,
            municipality: entity.municipality,
            city: entity.city,
            neighborhood: entity.neighborhood,
            street: entity.street,
            externalNumber: entity.externalNumber,
            internalNumber: entity.internalNumber,
            reference: entity.reference,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt,
            branchOffice: entity.branchOffice? BranchOfficeMapper.toResponseDto(entity.branchOffice): null,
            employee: entity.employee? EmployeeMapper.toResponseDto(entity.employee): null,
        }
        return dto;
    }
    public static toIResponse(entity: AddressEntity){
        const dto: IAddress = {
            addressId: entity.addressId,
            country: entity.country,
            state: entity.state,
            postalCode: entity.postalCode,
            municipality: entity.municipality,
            city: entity.city,
            neighborhood: entity.neighborhood,
            street: entity.street,
            externalNumber: entity.externalNumber,
            internalNumber: entity.internalNumber,
            reference: entity.reference,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt,
            branchOffice: entity.branchOffice? BranchOfficeMapper.toIResponse(entity.branchOffice): null,
            employee: entity.employee? EmployeeMapper.toIResponse(entity.employee): null,
        }
        return dto;
    }
}