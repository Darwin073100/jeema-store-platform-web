import { useState } from "react";
import { useRouter } from "next/navigation";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { useBrandStore } from "../stores/brand.store";
import { deleteBrandAction } from "@/contexts/product-management/brand/presentation/actions/delete-brand.action";

const useDeleteBrand = () => {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isConfirming, setIsConfirming] = useState<boolean>(false);
    const [deletingBrandId, setDeletingBrandId] = useState<bigint | null>(null);
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const { removeBrand } = useBrandStore();
    const router = useRouter();
    
    const showConfirmation = (brandId: bigint) => {
        if (isDeleting && deletingBrandId === brandId) {
            // Si ya está en modo de eliminación para esta marca, cancelar
            setIsDeleting(false);
            setDeletingBrandId(null);
        } else {
            // Mostrar confirmación para esta marca
            setIsDeleting(true);
            setDeletingBrandId(brandId);
        }
    };

    const confirmDelete = async (brandId: bigint) => {
        setIsConfirming(true);
        setFloatMessageState(() => ({}));

        try {
            const result = await deleteBrandAction(brandId);

            if (result?.ok) {
                // Remover del store local para feedback inmediato
                removeBrand(brandId);
                
                // Refrescar datos del servidor
                router.refresh();
                
                setFloatMessageState(() => ({
                    description: 'Marca eliminada correctamente',
                    summary: '¡Correcto!',
                    isActive: true,
                    type: 'blue'
                }));

                setTimeout(() => {
                    setFloatMessageState(() => ({}));
                }, 4000);

            } else {
                setFloatMessageState(() => ({
                    description: result?.error?.message || 'Error al eliminar la marca',
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
                description: 'Error inesperado al eliminar la marca',
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
            setDeletingBrandId(null);
        }
    };

    const cancelDelete = () => {
        setIsDeleting(false);
        setDeletingBrandId(null);
    };

    // Método legacy mantenido para compatibilidad
    const deleteBrand = async (brandId: bigint) => {
        try {
            setIsConfirming(true);

            const result = await deleteBrandAction(brandId);

            if (!result.ok) {
                return false;
            }

            return true;
        } catch (error) {
            return false;
        } finally {
            setIsConfirming(false);
        }
    };

    return {
        isDeleting,
        isConfirming,
        deletingBrandId,
        floatMessageState,
        setFloatMessageState,
        showConfirmation,
        confirmDelete,
        cancelDelete,
        // Mantener el método anterior para compatibilidad
        deleteBrand,
        isLoading: isConfirming,
        error: null,
    }
}

export { useDeleteBrand };
