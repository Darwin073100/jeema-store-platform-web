import { useState } from "react";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { deleteInventoryItemAction } from "../../../../../features/inventory/actions/delete-inventory-item.action";
import { useDeleteInventoryItemStore } from "../stores/delete-inventory-item.store";

const useDeleteInventoryItemModal = () => {
    const { handleTrueDeleteOpenModal, handleFalseDeleteOpenModal, deleteOpenModal,
        inventoryItemId, setInventoryItemId
    } = useDeleteInventoryItemStore();
    
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ floatMessageState, setFloatMessageState ] = useState<FloatMessageType>({});

    const handleOpenModalDeleteInventoryItem = (inventoryItemId: bigint)=> {
        setInventoryItemId(inventoryItemId);
        handleTrueDeleteOpenModal();
    }

    const onSubmit = async () => {
        setFloatMessageState({});
        setIsLoading(true);

        try {
            // Evita que la peticion llegue hasta el servidor si el id es nulo
            if(!inventoryItemId) throw new Error('Ha ocurrido un error al seleccionar el item de inventario.');
            
            const result = await deleteInventoryItemAction(inventoryItemId);
            
            if (result.ok) {
                setFloatMessageState({
                    summary: '¡Eliminado!',
                    isActive: true,
                    type: 'green',
                    description: '¡El stock se ha eliminado correctamente.!'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                    handleFalseDeleteOpenModal();
                }, 3000);
            } else {
                const errorMessage = Array.isArray(result?.error) 
                    ? result.error.join(', ') 
                    : result?.error?.message || 'Error al eliminar un ubicacion';
                
                setFloatMessageState({
                    description: errorMessage,
                    summary: '¡Error!',
                    isActive: true,
                    type: 'red'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                }, 4000);
            }
        } catch(error){
            setFloatMessageState({
                description: 'Error inesperado al eliminar un ubicacion',
                summary: '¡Error!',
                isActive: true,
                type: 'red'
            });

            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        handleFalseDeleteOpenModal,
        handleOpenModalDeleteInventoryItem,
        deleteOpenModal,
        onSubmit,
        // UI states
        floatMessageState,
        isLoading
    }
}

export { useDeleteInventoryItemModal };
