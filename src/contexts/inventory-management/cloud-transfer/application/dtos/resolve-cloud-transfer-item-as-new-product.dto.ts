export interface ResolveCloudTransferItemAsNewProductDto {
    cloudTransferItemId: bigint;
    establishmentId: bigint;
    branchOfficeId: bigint;
    /** Ya resuelto vía `MapCloudCategoryToLocalCategoryUseCase`. */
    localCategoryId: bigint;
    /** Opcional; se puede omitir en v1 dejando `brandId` null (mismo patrón que categoría, fuera de detalle). */
    localBrandId?: bigint;
    /**
     * Configuración de inventario para ESTA sucursal (B). La nube solo trae "sugerencias" de precio del
     * origen (`CloudTransferItemEntity.inventorySuggested*`, precios de A) — min/max stock son metas
     * puramente locales que nunca viajan entre sucursales. El usuario confirma/edita estos valores en el
     * modal de resolución antes de crear el producto; si se omiten, el use-case cae de vuelta a la
     * sugerencia de la nube (o `null` cuando no hay sugerencia posible, como min/max stock).
     */
    internalBarCode?: string | null;
    salePriceOne?: number | null;
    salePriceMany?: number | null;
    saleQuantityMany?: number | null;
    salePriceSpecial?: number | null;
    minStockBranch?: number | null;
    maxStockBranch?: number | null;
}
