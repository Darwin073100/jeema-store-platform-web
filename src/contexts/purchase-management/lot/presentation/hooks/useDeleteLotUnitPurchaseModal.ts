'use client'
import { useState } from "react";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { useDeleteLotUnitPurchaseStore } from "../stores/delete-lot-unit-purchase.store";
import { deleteLotUniPurchaseAction } from "../actions/delete-lot-unit-purchase.action";

const useDeleteLotUnitPurchaseModal = () => {
    const { handleTrueDeleteOpenModal, handleFalseDeleteOpenModal, deleteOpenModal,
        lotId, lotUnitPurchaseId, setLotId, setLotUnitPurchaseId
    } = useDeleteLotUnitPurchaseStore();
    
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ floatMessageState, setFloatMessageState ] = useState<FloatMessageType>({});

    const handleOpenModalDeleteLotUnitPurchase = (lotId: bigint, lotUnitPurchaseId: bigint)=> {
        setLotId(lotId);
        setLotUnitPurchaseId(lotUnitPurchaseId);
        handleTrueDeleteOpenModal();
    }

    const onSubmit = async () => {
        setFloatMessageState({});
        setIsLoading(true);

        try {
            // Evita que la peticion llegue hasta el servidor si uno de los dos id es nulo
            if(!lotUnitPurchaseId || !lotId) throw new Error('Ha ocurrido un error en el proceso.');
            
            const result = await deleteLotUniPurchaseAction(lotId, lotUnitPurchaseId);
            
            if (result.ok) {
                setFloatMessageState({
                    summary: '¡Eliminado!',
                    isActive: true,
                    type: 'green',
                    description: '¡Unidad eliminada!'
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
        handleOpenModalDeleteLotUnitPurchase,
        deleteOpenModal,
        onSubmit,
        // UI states
        floatMessageState,
        isLoading
    }
}

export { useDeleteLotUnitPurchaseModal };
