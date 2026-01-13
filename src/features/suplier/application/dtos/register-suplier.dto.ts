import { RegisterAddressDTO } from "@/shared/application/dtos/register-address.dto";

export interface RegisterSuplierDto {
    readonly establishmentId: bigint;
    readonly name: string;
    readonly phoneNumber: string | null;
    readonly rfc: string | null;
    readonly contactPerson: string | null;
    readonly email: string | null;
    readonly notes: string | null;
    readonly address: RegisterAddressDTO | null;
}