import { IAddress } from "@/contexts/establishment-management/address/presentation/interfaces/IAddress";

export interface ISuplier {
    suplierId: bigint,
    addressId: bigint | null,
    name: string,
    phoneNumber: string | null,
    address: IAddress | null,
    createdAt: Date,
    rfc: string | null,
    contactPerson: string | null,
    email: string | null,
    notes: string | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
}
