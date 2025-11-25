import { RegisterAddressHttpDTO } from "@/shared/infrastructure/http/address/dtos/register-address-http.dto";

export interface RegisterCustomerHttpDTO {
    firstName: string;
    saleDefault: boolean;
    lastName?: string;
    companyName?: string;
    phoneNumber?: string;
    rfc?: string;
    email?: string;
    customerType?: string;
    address?: RegisterAddressHttpDTO;
    establishmentId?: string;
}