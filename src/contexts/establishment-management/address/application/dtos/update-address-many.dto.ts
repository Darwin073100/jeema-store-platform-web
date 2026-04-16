export interface UpdateAddressMany {
    addressId: bigint;
    customerId: bigint | null;
    employeeId: bigint | null;
    suplierId: bigint | null;
    branchOfficeId: bigint | null;
    street?: string | null;
    externalNumber?: string | null;
    internalNumber?: string | null;
    neighborhood?: string | null;
    municipality?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    reference?: string | null;
}