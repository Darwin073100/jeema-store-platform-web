export interface AddressEntity {
    addressId       : bigint;
    street          : string;
    externalNumber  : string;
    internalNumber? : string | null;
    municipality    : string;
    neighborhood    : string;
    city            : string;
    state           : string;
    postalCode      : string;
    country         : string;
    reference?      : string | null;
    createdAt        : Date;
    updatedAt?       : Date | null;
    deletedAt?       : Date | null;
}