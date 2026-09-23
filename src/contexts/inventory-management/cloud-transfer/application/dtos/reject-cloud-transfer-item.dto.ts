/**
 * Implícito en el enum de resolución (no listado explícitamente en la tarea original), pero necesario para
 * que `ApproveCloudTransferUseCase` pueda avanzar con líneas que B decide no recibir. Ver
 * spect/08_cloud_transfer_spect.md sección 5.9.
 */
export interface RejectCloudTransferItemDto {
    cloudTransferItemId: bigint;
    reason: string;
}
