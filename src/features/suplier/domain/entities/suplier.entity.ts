import { EstablishmentEntity } from "@/features/establishment/domain/entities/establishment.entity";
import { AddressEntity } from "@/shared/domain/entities/address.entity";

export interface SuplierEntity {
    readonly suplierId: bigint;
    readonly establishmentId: bigint;
    readonly name: string;
    readonly phoneNumber: string | null;
    readonly rfc: string | null;
    readonly contactPerson: string | null;
    readonly email: string | null;
    readonly notes: string | null;
    readonly address: AddressEntity | null;
    readonly establishment: EstablishmentEntity | null;
    readonly createdAt: Date;
    readonly updatedAt: Date | null;
    readonly deletedAt: Date | null;
}