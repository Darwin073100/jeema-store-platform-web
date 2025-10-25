export interface RegisterAddressDTO{
    street: string | null;
    externalNumber: string | null;
    internalNumber: string | null;
    neighborhood: string | null;
    municipality: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    reference: string | null;
}