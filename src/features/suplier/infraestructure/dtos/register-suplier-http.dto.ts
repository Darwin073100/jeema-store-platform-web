import { RegisterAddressHttpDTO } from "@/shared/infrastructure/http/address/dtos/register-address-http.dto";

export interface RegisterSuplierHttpDto {
    readonly establishmentId: string;
    readonly name: string;
    readonly phoneNumber?: string;
    readonly rfc?: string;
    readonly contactPerson?: string;
    readonly email?: string;
    readonly notes?: string;
    readonly address?: RegisterAddressHttpDTO;
}