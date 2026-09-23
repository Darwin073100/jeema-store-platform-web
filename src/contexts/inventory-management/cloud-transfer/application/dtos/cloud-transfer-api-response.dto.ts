import { ProductBlockHttpDto, LotBlockHttpDto, InventoryBlockHttpDto } from "./create-cloud-transfer-http.dto";

/**
 * Forma REAL confirmada del response 200/201 de los 8 endpoints de `cloud-transfers`, verificada con una
 * llamada real (`POST /api/v1/cloud-transfers` contra `http://localhost:3001`, ver sección 6 del plan de
 * implementación) — NO es una inferencia. El spec (spect/08_cloud_transfer_spect.md sección 4.3) marcaba
 * esto como pregunta abierta/inferencia sin confirmar; el shape real difiere bastante de lo inferido ahí:
 *
 * - Los items NO vienen en un array top-level `items` con `cloudTransferItemId` propio: vienen anidados en
 *   `payload.items`, sin ningún id individual asignado por el servidor (el servidor los persiste como JSON,
 *   no como filas propias). Por eso `CloudTransferItemEntity` nunca necesita un "remoteCloudTransferItemId".
 * - Hay un `cloudEstablishmentId` derivado (ambas sucursales deben pertenecer al mismo establecimiento en la
 *   nube — hallazgo real no documentado explícitamente en el spec, ver nota de desviación en
 *   `cloud-transfer-api.mapper.ts`).
 * - El campo de notas de resolución se llama `notes` (no `resolutionNotes`).
 * - Hay timestamps por fase (`inTransitAt`/`approvedAt`/`receivedAt`/`cancelledAt`/`errorAt`) que este
 *   agregado no modela 1:1 (nuestro dominio solo guarda `resolutionNotes` con el último valor, sin
 *   histórico por fase — ver spect/08 sección 9, "fuera de alcance").
 */
export interface ICloudTransferApiResponseItem {
    originLocalProductId: string;
    originLocalLotId: string | null;
    originLocalInventoryItemId: string | null;
    product: ProductBlockHttpDto;
    lot: LotBlockHttpDto;
    inventory: InventoryBlockHttpDto;
}

export interface ICloudTransferApiResponse {
    cloudTransferId: string;
    cloudEstablishmentId: string;
    fromCloudBranchId: string;
    toCloudBranchId: string;
    localTransferId: string;
    payload: {
        shipmentNotes?: string | null;
        items: ICloudTransferApiResponseItem[];
    };
    status: string; // uno de CloudTransferStatusEnum
    notes: string | null;
    errorMessage: string | null;
    inTransitAt: string | null;
    approvedAt: string | null;
    receivedAt: string | null;
    cancelledAt: string | null;
    errorAt: string | null;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
}
