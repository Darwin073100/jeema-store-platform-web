import { useCallback, useEffect, useState } from "react";
import { findCloudTransferByIdAction } from "../actions/find-cloud-transfer-by-id.action";
import { refreshCloudTransferFromCloudAction } from "../actions/refresh-cloud-transfer-from-cloud.action";
import { startProcessingCloudTransferAction } from "../actions/start-processing-cloud-transfer.action";
import { receiveCloudTransferAction } from "../actions/receive-cloud-transfer.action";
import { approveCloudTransferAction } from "../actions/approve-cloud-transfer.action";
import { cancelCloudTransferAction } from "../actions/cancel-cloud-transfer.action";
import { errorCloudTransferAction } from "../actions/error-cloud-transfer.action";
import { retrySendCloudTransferAction } from "../actions/retry-send-cloud-transfer.action";
import { useCloudTransferStore } from "../stores/cloud-transfer.store";
import { useCloudTransferUIStore } from "../stores/cloud-transfer-ui.store";
import { ICloudTransfer } from "../interfaces/ICloudTransfer";
import { CloudTransferStatusEnum } from "../../domain/enums/cloud-transfer-status.enum";
import { CloudTransferDirectionEnum } from "../../domain/enums/cloud-transfer-direction.enum";
import { CloudTransferItemResolutionStatusEnum } from "../../domain/enums/cloud-transfer-item-resolution-status.enum";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

/** Lógica de la pantalla de detalle/procesamiento (`/transfers/detail/[cloudTransferId]`): trae el traspaso,
 * expone los botones de transición de estado según dirección + estado actual (ver
 * spect/09_..._spect.md para la tabla completa de qué botón aplica en qué combinación), y refresca después
 * de cada acción para que la tabla de resolución de items siempre muestre el estado real. */
const useCloudTransferDetail = (initialTransfer: ICloudTransfer) => {
    const { selectedTransfer, setSelectedTransfer } = useCloudTransferStore();
    const { cloudTransferLoading, runCloudTransferLoading, stopCloudTransferLoading, setFloatMessageState } = useCloudTransferUIStore();
    const [reasonPrompt, setReasonPrompt] = useState<'cancel' | 'error' | null>(null);

    useEffect(() => {
        setSelectedTransfer(initialTransfer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialTransfer.cloudTransferId]);

    const transfer = selectedTransfer ?? initialTransfer;

    /** Para un OUTGOING ya enviado a la nube, resincroniza contra EDYOF antes de leer (así se ve el avance
     * que hizo la sucursal destino: recepción/aprobación). Para todo lo demás, lectura local simple. */
    const refresh = useCallback(async () => {
        const result = (transfer.direction === CloudTransferDirectionEnum.OUTGOING && transfer.remoteCloudTransferId)
            ? await refreshCloudTransferFromCloudAction(transfer.cloudTransferId)
            : await findCloudTransferByIdAction(transfer.cloudTransferId);
        if (result.ok && result.value) {
            setSelectedTransfer(result.value);
        }
    }, [transfer.cloudTransferId, transfer.direction, transfer.remoteCloudTransferId, setSelectedTransfer]);

    useEffect(() => {
        if (initialTransfer.direction === CloudTransferDirectionEnum.OUTGOING && initialTransfer.remoteCloudTransferId) {
            refresh();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialTransfer.cloudTransferId]);

    const showError = (error?: ErrorEntity) => {
        setFloatMessageState({
            summary: error?.statusCode ? `${error.statusCode}: ¡Error!` : '500: ¡Error!',
            description: Array.isArray(error?.message) ? error.message.join(', ') : (error?.message?.toString() || 'Ocurrió un error inesperado.'),
            isActive: true,
            type: 'red',
        });
        setTimeout(() => setFloatMessageState({}), 5000);
    };

    const showSuccess = (description: string) => {
        setFloatMessageState({ summary: '¡Correcto!', description, isActive: true, type: 'green' });
        setTimeout(() => setFloatMessageState({}), 3000);
    };

    const runAction = async (
        loadingKey: Parameters<typeof runCloudTransferLoading>[0],
        action: () => Promise<{ ok: boolean; value?: ICloudTransfer; error?: ErrorEntity }>,
        successMessage: string,
    ) => {
        runCloudTransferLoading(loadingKey);
        try {
            const result = await action();
            if (!result.ok) {
                showError(result.error);
                return;
            }
            if (result.value) setSelectedTransfer(result.value);
            showSuccess(successMessage);
        } finally {
            stopCloudTransferLoading();
        }
    };

    const handleStartProcessing = () => runAction(
        'starting-processing',
        () => startProcessingCloudTransferAction(transfer.cloudTransferId),
        transfer.status === CloudTransferStatusEnum.ERROR ? '¡Reintento de procesamiento iniciado!' : '¡Procesamiento iniciado! Se intentó el emparejado automático por código de barras.',
    );

    const handleReceive = () => runAction(
        'receiving',
        () => receiveCloudTransferAction(transfer.cloudTransferId),
        '¡Recepción física confirmada!',
    );

    const handleApprove = () => runAction(
        'approving',
        () => approveCloudTransferAction(transfer.cloudTransferId),
        '¡Traspaso aprobado! El inventario ya se actualizó.',
    );

    const handleCancel = (reason: string) => runAction(
        'cancelling',
        () => cancelCloudTransferAction(transfer.cloudTransferId, reason || undefined),
        '¡Traspaso cancelado!',
    );

    const handleReportError = (reason: string) => runAction(
        'reporting-error',
        () => errorCloudTransferAction(transfer.cloudTransferId, reason),
        'Error reportado. Podrás reintentar el procesamiento desde aquí.',
    );

    const handleRetrySend = () => runAction(
        'retrying-send',
        () => retrySendCloudTransferAction(transfer.cloudTransferId),
        '¡Traspaso enviado a la nube!',
    );

    const handleRefresh = async () => {
        runCloudTransferLoading('refreshing');
        try {
            await refresh();
        } finally {
            stopCloudTransferLoading();
        }
    };

    const isIncoming = transfer.direction === CloudTransferDirectionEnum.INCOMING;
    const isOutgoing = transfer.direction === CloudTransferDirectionEnum.OUTGOING;
    const hasUnresolvedItems = transfer.items.some(i => i.resolutionStatus === CloudTransferItemResolutionStatusEnum.PENDING);
    const notSentToCloud = !transfer.remoteCloudTransferId;

    const canStartProcessing = isIncoming && transfer.status === CloudTransferStatusEnum.PENDING;
    const canRetryProcessing = isIncoming && transfer.status === CloudTransferStatusEnum.ERROR;
    const canReceive = isIncoming && transfer.status === CloudTransferStatusEnum.IN_TRANSIT;
    const canApprove = isIncoming && transfer.status === CloudTransferStatusEnum.RECEIVED;
    const canReportError = isIncoming && transfer.status === CloudTransferStatusEnum.IN_TRANSIT;
    const canCancel = [CloudTransferStatusEnum.PENDING, CloudTransferStatusEnum.IN_TRANSIT, CloudTransferStatusEnum.RECEIVED].includes(transfer.status);
    const canRetrySend = isOutgoing && transfer.status === CloudTransferStatusEnum.PENDING && notSentToCloud;
    const showResolutionTable = isIncoming && [CloudTransferStatusEnum.IN_TRANSIT, CloudTransferStatusEnum.RECEIVED, CloudTransferStatusEnum.APPROVED].includes(transfer.status);

    return {
        transfer,
        refresh,
        handleRefresh,
        loading: cloudTransferLoading,
        reasonPrompt,
        setReasonPrompt,
        handleStartProcessing,
        handleReceive,
        handleApprove,
        handleCancel,
        handleReportError,
        handleRetrySend,
        isIncoming,
        isOutgoing,
        hasUnresolvedItems,
        canStartProcessing,
        canRetryProcessing,
        canReceive,
        canApprove,
        canReportError,
        canCancel,
        canRetrySend,
        showResolutionTable,
    };
};

export { useCloudTransferDetail };
