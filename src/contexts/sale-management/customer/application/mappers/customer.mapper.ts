import { EstablishmentMapper } from "src/contexts/establishment-management/establishment/application/mappers/establishment.mapper";
import { CustomerEntity } from "../../domain/entities/customer.entity";
import { CustomerResponseDto } from "../dtos/customer-response.dto";
import { SaleMapper } from "src/contexts/sale-management/sale/application/mappers/sale-mapper";
import { AddressMapper } from "src/shared/application/mappers/address.mapper";

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
}