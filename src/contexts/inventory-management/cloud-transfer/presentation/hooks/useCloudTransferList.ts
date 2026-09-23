import { useCallback, useEffect, useMemo } from "react";
import { listCloudTransfersForBranchAction } from "../actions/list-cloud-transfers-for-branch.action";
import { refreshPendingCloudTransfersAction } from "../actions/refresh-pending-cloud-transfers.action";
import { useCloudTransferStore } from "../stores/cloud-transfer.store";
import { useCloudTransferUIStore } from "../stores/cloud-transfer-ui.store";

/** Lógica de la pantalla de lista (`/transfers/list`): trae saliente + entrante, permite refrescar
 * lo entrante contra la nube (`refreshPendingCloudTransfersAction`) y filtra por pestaña activa. */
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

    const handleRefreshIncoming = async () => {
        runCloudTransferLoading('refreshing');
        try {
            const result = await refreshPendingCloudTransfersAction();
            if (result.ok) {
                setFloatMessageState({
                    summary: '¡Correcto!',
                    description: '¡Lista de traspasos entrantes actualizada!',
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
        loadTransfers,
    };
};

export { useCloudTransferList };
