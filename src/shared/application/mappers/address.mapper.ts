import { RegisterAddressHttpDTO } from "@/shared/infrastructure/http/address/dtos/register-address-http.dto";
import { RegisterAddressDTO } from "../dtos/register-address.dto";

export class AddressMapper{
    public static toRegisterAddressHttpDTO(dto: RegisterAddressDTO){
        const httpDto: RegisterAddressHttpDTO = {
            country: dto.country,
            state: dto.state,
            postalCode: dto.postalCode,
            municipality: dto.municipality,
            city: dto.city,
            neighborhood: dto.neighborhood && (dto.neighborhood.trim().length > 0) ? dto.neighborhood: undefined,
            street: dto.street && (dto.street.trim().length > 0) ? dto.street: undefined,
            internalNumber: dto.internalNumber && (dto.internalNumber.trim().length > 0) ? dto.internalNumber: undefined,
            externalNumber: dto.externalNumber && (dto.externalNumber.trim().length > 0) ? dto.externalNumber: undefined,
            reference: dto.reference && (dto.reference.trim().length > 0) ? dto.reference: undefined,
        }
        return httpDto;
    }
}