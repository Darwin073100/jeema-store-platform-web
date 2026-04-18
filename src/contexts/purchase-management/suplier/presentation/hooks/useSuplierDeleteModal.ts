'use client';
import { useSuplierStore } from "../stores/suplier.store";
import { useSuplierUIStore } from "../stores/suplier-ui.store";
import { updateSuplierAction } from "../actions/update-suplier.action";

const useSuplierDeleteModal = () => {
    const { suplier } = useSuplierStore();
    const { setFloatMessageState, loading, runLoading, stopLoading, suplierModal, closeSuplierModal } = useSuplierUIStore();

    const onSubmit = async () => {
        runLoading('deleteSuplier');

        const result = await updateSuplierAction({
            suplierId: suplier?.suplierId ?? BigInt(0),
            softDelete: true
        });
        stopLoading();

        if (result.ok) {
            closeSuplierModal();
            setFloatMessageState({
                summary: '¡Correcto!',
                description: 'Datos guardados correctamente',
                isActive: true,
                type: 'green'
            });
            setTimeout(() => {
                setFloatMessageState({});
            }, 3000);
        } else {
            setFloatMessageState({
                summary: `${result.error?.statusCode}: ¡Error!`,
                description: result.error?.message,
                isActive: true,
                type: 'red'
            });
            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
        }
    }
    return {
        onSubmit,
        loading,
    }
}

export { useSuplierDeleteModal };