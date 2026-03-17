import { useState } from "react";
import { useRouter } from "next/navigation";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { useCategoryStore } from "../stores/category.store";
import { UpdateCategoryDTO } from "@/contexts/product-management/category/application/dtos/update-category.dto";
import { updateCategoryAction } from "@/contexts/product-management/category/presentation/actions/update-category.action";

const useUpdateCategory = () => {
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const { updateCategory, setCategory } = useCategoryStore();
    const router = useRouter();
    
    const handleUpdate = async (updateData: UpdateCategoryDTO) => {
        setIsUpdating(true);
        setFloatMessageState(() => ({}));

        try {
            const result = await updateCategoryAction(updateData);

            if (result?.ok && result.value) {
                // Actualizar en el store local para feedback inmediato
                updateCategory(result.value);
                
                // Limpiar la categoría seleccionada
                setCategory(null);
                
                // Refrescar datos del servidor
                router.refresh();
                
                setFloatMessageState(() => ({
                    description: 'Categoría actualizada correctamente',
                    summary: '¡Correcto!',
                    isActive: true,
                    type: 'blue'
                }));

                setTimeout(() => {
                    setFloatMessageState(() => ({}));
                }, 4000);

                return { success: true };
            } else {
                setFloatMessageState(() => ({
                    description: result?.error?.message || 'Error al actualizar la categoría',
                    summary: '¡Error!',
                    isActive: true,
                    type: 'red'
                }));

                setTimeout(() => {
                    setFloatMessageState(() => ({}));
                }, 6000);

                return { success: false, error: result?.error?.message };
            }
        } catch (error) {
            setFloatMessageState(() => ({
                description: 'Error inesperado al actualizar la categoría',
                summary: '¡Error!',
                isActive: true,
                type: 'red'
            }));

            setTimeout(() => {
                setFloatMessageState(() => ({}));
            }, 6000);

            return { success: false, error: 'Error inesperado' };
        } finally {
            setIsUpdating(false);
        }
    };

    const cancelUpdate = () => {
        setCategory(null);
        setFloatMessageState(() => ({}));
    };

    return {
        isUpdating,
        floatMessageState,
        setFloatMessageState,
        handleUpdate,
        cancelUpdate
    }
}

export { useUpdateCategory };
