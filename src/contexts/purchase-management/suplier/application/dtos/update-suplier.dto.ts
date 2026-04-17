export interface UpdateSuplierDto {
    readonly suplierId: bigint;
    readonly name?: string;
    readonly phoneNumber?: string | null;
    readonly rfc?: string | null;
    readonly contactPerson?: string | null;
    readonly email?: string | null;
    readonly notes?: string | null;
  }