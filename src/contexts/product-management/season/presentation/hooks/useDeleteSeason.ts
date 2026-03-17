import { useState } from "react";
import { useRouter } from "next/navigation";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { useSeasonStore } from "../stores/season.store";
import { deleteSeasonAction } from "@/contexts/product-management/season/presentation/actions/delete-season.action";

const useDeleteSeason = () => {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isConfirming, setIsConfirming] = useState<boolean>(false);
    const [deletingSeasonId, setDeletingSeasonId] = useState<bigint | null>(null);
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const { removeSeason } = useSeasonStore();
    const router = useRouter();
    
    const showConfirmation = (seasonId: bigint) => {
        if (isDeleting && deletingSeasonId === seasonId) {
            // Si ya está en modo de eliminación para esta temporada, cancelar
            setIsDeleting(false);
            setDeletingSeasonId(null);
        } else {
            // Mostrar confirmación para esta temporada
            setIsDeleting(true);
            setDeletingSeasonId(seasonId);
        }
    };

    const confirmDelete = async (seasonId: bigint) => {
        setIsConfirming(true);
        setFloatMessageState(() => ({}));

        try {
            const result = await deleteSeasonAction(seasonId);

            if (result?.ok) {
                // Remover del store local para feedback inmediato
                removeSeason(seasonId);
                
                // Refrescar datos del servidor
                router.refresh();
                
                setFloatMessageState(() => ({
                    description: 'Temporada eliminada correctamente',
                    summary: '¡Correcto!',
                    isActive: true,
                    type: 'blue'
                }));

                setTimeout(() => {
                    setFloatMessageState(() => ({}));
                }, 4000);

            } else {
                setFloatMessageState(() => ({
                    description: result?.error?.message || 'Error al eliminar la temporada',
                    summary: '¡Error!',
                    isActive: true,
                    type: 'red'
                }));

                setTimeout(() => {
                    setFloatMessageState(() => ({}));
                }, 6000);
            }
        } catch (error) {
            setFloatMessageState(() => ({
                description: 'Error inesperado al eliminar la temporada',
                summary: '¡Error!',
                isActive: true,
                type: 'red'
            }));

            setTimeout(() => {
                setFloatMessageState(() => ({}));
            }, 6000);
        } finally {
            setIsConfirming(false);
            setIsDeleting(false);
            setDeletingSeasonId(null);
        }
    };

    const cancelDelete = () => {
        setIsDeleting(false);
        setDeletingSeasonId(null);
    };

    return {
        isDeleting,
        isConfirming,
        deletingSeasonId,
        floatMessageState,
        setFloatMessageState,
        showConfirmation,
        confirmDelete,
        cancelDelete,
        // Mantener el método anterior para compatibilidad
        handleDelete: showConfirmation
    }
}

export { useDeleteSeason };
