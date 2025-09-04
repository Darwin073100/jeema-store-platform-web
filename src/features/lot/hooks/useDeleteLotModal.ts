import { useState } from "react";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { useDeleteLotStore } from "../infraestructure/store/delete-lot.store";
import { deleteLotAction } from "../actions/delete-lot.action";

const useDeleteLotModal = () => {
    const { handleTrueDeleteOpenModal, handleFalseDeleteOpenModal, deleteOpenModal,
        lotId, setLotId
    } = useDeleteLotStore();
    
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ floatMessageState, setFloatMessageState ] = useState<FloatMessageType>({});

    const handleOpenModalDeleteLot = (selectedLotId: bigint)=> {
        setLotId(selectedLotId);
        handleTrueDeleteOpenModal();
    }

    const onSubmit = async () => {
        setFloatMessageState({});
        setIsLoading(true);

        try {
            // Evita que la peticion llegue hasta el servidor si uno de los dos id es nulo
            if( !lotId) throw new Error('Ha ocurrido un error en el proceso.');
            
            const result = await deleteLotAction(lotId);
            
            if (result.ok) {
                setFloatMessageState({
                    summary: '¡Eliminado!',
                    isActive: true,
                    type: 'green',
                    description: '¡Lote eliminada!'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                    handleFalseDeleteOpenModal();
                }, 3000);
            } else {
                const errorMessage = Array.isArray(result?.error) 
                    ? result.error.join(', ') 
                    : result?.error?.message || 'Error al eliminar una unidad';
                
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
                description: 'Error inesperado al eliminar una unidad',
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
        handleOpenModalDeleteLot,
        deleteOpenModal,
        onSubmit,
        // UI states
        floatMessageState,
        isLoading
    }
}

export { useDeleteLotModal };
