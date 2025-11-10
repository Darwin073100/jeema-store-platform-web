export interface CreateBranchOfficeDTO{
        establishmentId: bigint;
        name: string;
        street: string | null;
        externalNumber: string | null;
        internalNumber: string | null;
        municipality: string;
        neighborhood: string | null;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        reference: string|null;
}