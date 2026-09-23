export interface ResolveCloudTransferItemAsNewProductDto {
    cloudTransferItemId: bigint;
    establishmentId: bigint;
    branchOfficeId: bigint;
    /** Ya resuelto vía `MapCloudCategoryToLocalCategoryUseCase`. */
    localCategoryId: bigint;
    /** Opcional; se puede omitir en v1 dejando `brandId` null (mismo patrón que categoría, fuera de detalle). */
    localBrandId?: bigint;
}
