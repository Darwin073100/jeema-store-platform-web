export interface ResolveCloudTransferItemAsExistingProductDto {
    cloudTransferItemId: bigint;
    matchedLocalProductId: bigint;
    /** Sucursal de B en la que se resuelve el item; se usa para buscar el `Inventory` local ya existente. */
    branchOfficeId: bigint;
}
