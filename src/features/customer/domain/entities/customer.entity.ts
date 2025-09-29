import { AddressEntity } from "@/shared/domain/entities/address.entity";

export interface CustomerEntity {
    customerId       : bigint;
    addressId?       : bigint|null;
    establishmentId? : bigint|null;
    firstName        : string;
    lastName?        : string|null;
    companyName?     : string|null;
    phoneNumber?     : string|null;
    rfc?             : string | null;
    email?           : string | null;
    customerType?    : string | null;
    createdAt        : Date;
    updatedAt?       : Date | null;
    deletedAt?       : Date | null;
    address?         : AddressEntity | null;
}