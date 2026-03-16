import { EstablishmentMapper } from "src/contexts/establishment-management/establishment/application/mappers/establishment.mapper";
import { CustomerEntity } from "../../domain/entities/customer.entity";
import { CustomerResponseDto } from "../dtos/customer-response.dto";
import { SaleMapper } from "src/contexts/sale-management/sale/application/mappers/sale-mapper";
import { AddressMapper } from "@/contexts/establishment-management/address/application/mappers/address.mapper";
import { ICustomer } from "../../presentation/interfaces/ICustomer";

export class CustomerMapper {
    public static toResponseDto(entity: CustomerEntity): CustomerResponseDto {
      return new CustomerResponseDto(
        entity.customerId,
        entity.createdAt,
        entity.firstName.value,
        entity.saleDefault,
        entity.establishmentId,
        entity.lastName?.value,
        entity.companyName?.value,
        entity.addressId,
        entity?.phoneNumber?.value,
        entity.address? AddressMapper.toResponseDTO(entity.address): undefined,
        entity.rfc?.value,
        entity.email?.value,
        entity.customerType?.value,
        entity.updatedAt,
        entity.deletedAt,
        entity.establishment ? EstablishmentMapper.toResponseDto(entity.establishment): null,
        entity.sales ? entity.sales.map(item => SaleMapper.toResponseDto(item)): []
      );
    }
    public static toIResponse(entity: CustomerEntity): ICustomer {
      return {
        customerId: entity.customerId,
        createdAt: entity.createdAt,
        firstName: entity.firstName.value,
        saleDefault: entity.saleDefault,
        establishmentId: entity.establishmentId ?? null,
        lastName: entity.lastName?.value ?? null,
        companyName: entity.companyName?.value ?? null,
        addressId: entity.addressId ?? null,
        phoneNumber: entity.phoneNumber?.value ?? null,
        address: entity.address? AddressMapper.toIResponse(entity.address): null,
        rfc: entity.rfc?.value ?? null,
        email: entity.email?.value ?? null,
        customerType: entity.customerType?.value ?? null,
        updatedAt: entity.updatedAt ?? null,
        deletedAt: entity.deletedAt ?? null,
        establishment: entity.establishment ? EstablishmentMapper.toIResponse(entity.establishment): null,
        sales: entity.sales ? entity.sales.map(item => SaleMapper.toIResponse(item)): []
      }
    }
}