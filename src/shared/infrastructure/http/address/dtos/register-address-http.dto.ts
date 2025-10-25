export interface RegisterAddressHttpDTO{
    street: string | undefined;
    externalNumber: string | undefined;
    internalNumber: string | undefined;
    neighborhood: string | undefined;
    municipality: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    reference: string | undefined;
}