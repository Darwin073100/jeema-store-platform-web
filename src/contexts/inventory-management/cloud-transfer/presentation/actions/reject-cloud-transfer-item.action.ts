'use server'
import { TypeormCloudTransferItemRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer-item.repository";
import { RejectCloudTransferItemUseCase } from "../../application/use-cases/reject-cloud-transfer-item.use-case";
import { CloudTransferMapper } from "../../application/mappers/cloud-transfer.mapper";
import { ICloudTransferItem } from "../interfaces/ICloudTransferItem";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

/**
 * Gap de backend corregido por el pase de frontend (ver spect/09_..._spect.md): `RejectCloudTransferItemUseCase`
 * y su DTO ya existían (application/use-cases, application/dtos) pero no tenían Server Action — sin esta
 * acción, la UI de resolución no podía cerrar el ciclo de un item que B decide no recibir (dañado, extraviado,
 * etc.), lo que dejaría el traspaso permanentemente bloqueado en `ApproveCloudTransferUseCase`
 * (`CloudTransferItemNotResolvedException`). Sigue exactamente el mismo patrón que el resto de las 14
 * acciones ya existentes en esta carpeta.
 */
export async function rejectCloudTransferItemAction(
    cloudTransferItemId: bigint,
    reason: string,
): Promise<{ ok: boolean; value?: ICloudTransferItem; error?: ErrorEntity }> {
    try {
        const cloudTransferItemRepository = await TypeormCloudTransferItemRepository.create();
        const useCase = new RejectCloudTransferItemUseCase(cloudTransferItemRepository);

        const result = await useCase.execute({ cloudTransferItemId, reason });

        return { ok: true, value: CloudTransferMapper.itemToIResponse(result) };
    } catch (error) {
        console.error('rejectCloudTransferItemAction: ', error);
        return {
            ...handleError(error, 'rejectCloudTransferItemAction'),
        };
    }
}
