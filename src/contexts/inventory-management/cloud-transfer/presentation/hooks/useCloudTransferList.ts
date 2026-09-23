import { useCallback, useEffect, useMemo } from "react";
import { listCloudTransfersForBranchAction } from "../actions/list-cloud-transfers-for-branch.action";
import { refreshPendingCloudTransfersAction } from "../actions/refresh-pending-cloud-transfers.action";
import { refreshOutgoingCloudTransfersAction } from "../actions/refresh-outgoing-cloud-transfers.action";
import { useCloudTransferStore } from "../stores/cloud-transfer.store";
import { useCloudTransferUIStore } from "../stores/cloud-transfer-ui.store";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

/** Lógica de la pantalla de lista (`/transfers/list`): trae saliente + entrante, permite refrescar lo
 * entrante contra la nube (`refreshPendingCloudTransfersAction`, descubre traspasos nuevos), permite
 * refrescar lo saliente contra la nube (`refreshOutgoingCloudTransfersAction`, trae el avance de lo ya
 * enviado: recepción/aprobación hecha por la sucursal destino) y filtra por pestaña activa. */
const useCloudTransferList = () => {
    const { transfers, setTransfers } = useCloudTransferStore();
    const {
        listTab, setListTab,
        cloudTransferLoading, runCloudTransferLoading, stopCloudTransferLoading,
        setFloatMessageState,
    } = useCloudTransferUIStore();

    const loadTransfers = useCallback(async () => {
        runCloudTransferLoading('listing');
        try {
            const result = await listCloudTransfersForBranchAction();
            if (result.ok) {
                setTransfers(result.value ?? []);
            } else {
                setFloatMessageState({
                    summary: result.error?.statusCode ? `${result.error.statusCode}: ¡Error!` : '500: ¡Error!',
                    description: result.error?.message?.toString() || 'No se pudo cargar la lista de traspasos.',
                    isActive: true,
                    type: 'red',
                });
                setTimeout(() => setFloatMessageState({}), 4000);
            }
        } finally {
            stopCloudTransferLoading();
        }
    }, [runCloudTransferLoading, stopCloudTransferLoading, setTransfers, setFloatMessageState]);

    useEffect(() => {
        loadTransfers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const runRefresh = async (
        action: () => Promise<{ ok: boolean; error?: ErrorEntity }>,
        successMessage: string,
    ) => {
        runCloudTransferLoading('refreshing');
        try {
            const result = await action();
            if (result.ok) {
                setFloatMessageState({
                    summary: '¡Correcto!',
                    description: successMessage,
                    isActive: true,
                    type: 'green',
                });
                await loadTransfers();
            } else {
                setFloatMessageState({
                    summary: result.error?.statusCode ? `${result.error.statusCode}: ¡Error!` : '500: ¡Error!',
                    description: result.error?.message?.toString() || 'No se pudo conectar con la nube. Se muestra lo último sincronizado.',
                    isActive: true,
                    type: 'red',
                });
            }
            setTimeout(() => setFloatMessageState({}), 4000);
        } finally {
            stopCloudTransferLoading();
        }
    };

    const handleRefreshIncoming = () => runRefresh(refreshPendingCloudTransfersAction, '¡Lista de traspasos entrantes actualizada!');

    const handleRefreshOutgoing = () => runRefresh(refreshOutgoingCloudTransfersAction, '¡Estado de traspasos salientes actualizado!');

    const filteredTransfers = useMemo(
        () => transfers.filter(t => t.direction === listTab),
        [transfers, listTab],
    );

    return {
        transfers: filteredTransfers,
        listTab,
        setListTab,
        loading: cloudTransferLoading,
        handleRefreshIncoming,
        handleRefreshOutgoing,
        loadTransfers,
    };
};

export { useCloudTransferList };
