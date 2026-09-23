/**
 * El cliente solo manda ids locales + cantidad — nunca el contenido del snapshot (nombre de categoría,
 * marca, etc.). `CreateAndSendCloudTransferUseCase` reconstruye el snapshot leyendo las entidades reales
 * server-side (ver spect/08_cloud_transfer_spect.md sección 5.1).
 */
export interface CreateCloudTransferDto {
    fromBranchOfficeId: bigint;
    toCloudBranchOfficeId: bigint;
    shipmentNotes: string | null;
    requestedByEmployeeId: bigint;
    items: CreateCloudTransferItemDto[];
}

export interface CreateCloudTransferItemDto {
    originLocalProductId: bigint;
    originLocalLotId: bigint;
    originLocalInventoryItemId: bigint;
    quantityToTransfer: number;
}
