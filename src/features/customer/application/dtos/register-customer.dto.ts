import { RegisterAddressDTO } from "@/shared/application/dtos/register-address.dto";

export interface RegisterCustomerDTO {
    firstName: string;
    lastName?: string|null;
    companyName?: string|null;
    phoneNumber?: string|null;
    rfc?: string | null;
    email?: string | null;
    customerType?: string | null;
    address?: RegisterAddressDTO|null;
    establishmentId?: bigint|null;
}