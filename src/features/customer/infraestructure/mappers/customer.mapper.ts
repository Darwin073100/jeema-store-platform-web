import { AddressMapper } from "@/shared/application/mappers/address.mapper";
import { RegisterCustomerDTO } from "../../application/dtos/register-customer.dto";
import { RegisterCustomerHttpDTO } from "../dtos/register-customer-http.dto";

export class CustomerMapper {
    public static toRegisterCustomerHttpDTO(dto: RegisterCustomerDTO){
        const httpDTO: RegisterCustomerHttpDTO = {
            establishmentId: dto.establishmentId?.toString() ?? undefined,
            firstName: dto.firstName,
            saleDefault: dto.saleDefault,
            lastName: dto.lastName && (dto.lastName.trim().length > 0) ? dto.lastName : undefined,
            customerType: dto.customerType && (dto.customerType.trim().length > 0) ? dto.customerType : 'Minorista',
            email: dto.email && (dto.email.trim().length > 0) ? dto.email :undefined,
            phoneNumber: dto.phoneNumber && (dto.phoneNumber.trim().length > 0) ? dto.phoneNumber :undefined,
            rfc: dto.rfc && (dto.rfc.trim().length > 0) ? dto.rfc : undefined,
            companyName: dto.companyName && (dto.companyName?.trim().length > 0) ? dto.companyName: undefined,
            address: dto.address? AddressMapper.toRegisterAddressHttpDTO(dto.address): undefined
        }
        return httpDTO;
    }
}