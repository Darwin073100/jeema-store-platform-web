import { AddressMapper } from "@/shared/application/mappers/address.mapper";
import { RegisterSuplierDto } from "../../application/dtos/register-suplier.dto";
import { RegisterSuplierHttpDto } from "../dtos/register-suplier-http.dto";

export class SuplierMapper {
    static toRegisterSuplierHttp(dto: RegisterSuplierDto){
        const httpDto: RegisterSuplierHttpDto = {
            establishmentId: dto.establishmentId.toString(),
            name: dto.name,
            contactPerson: dto.contactPerson && (dto?.contactPerson?.trim().length > 0)? dto.contactPerson: undefined,
            email: dto.email && (dto?.email?.trim().length > 0)? dto.email: undefined,
            notes: dto.notes && (dto?.notes?.trim().length > 0)? dto.notes: undefined,
            phoneNumber: dto.phoneNumber && (dto?.phoneNumber?.trim().length > 0)? dto.phoneNumber: undefined,
            rfc: dto.rfc && (dto?.rfc?.trim().length > 0)? dto.rfc: undefined,
            address: dto.address? AddressMapper.toRegisterAddressHttpDTO(dto.address): undefined,
        } 
        return httpDto;
    }
}