export interface MapCloudCategoryToLocalCategoryDto {
    establishmentId: bigint;
    /** Si viene, mapeo a una categoría LOCAL ya existente. */
    localCategoryId?: bigint;
    /** Si viene (y no `localCategoryId`), crea una categoría LOCAL nueva con este nombre. */
    newCategoryName?: string;
    newCategoryDescription?: string | null;
}
