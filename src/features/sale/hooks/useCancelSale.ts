import { useState } from "react";
import { useSaleStore } from "../infraestructure/stores/sale.store";
import { useWorkspace } from "@/shared/hooks/useAuth";
import { cancelSaleAction } from "../actions/cancel-sale.action";
import { useSaleUIStore } from "../infraestructure/stores/sale.ui.store";


const useCancelSale = () => {

    // Estado global de la UI de Ventas
    const { 
        floatMessageState, setFloatMessageState, cancelSaleModal, closeCancelSaleModal, openCancelSaleModal
    } = useSaleUIStore();

    //Manejar estado cuanto la peticion este en proceso
    const [isCancelSaleLoading, setIsCancelSaleLoading] = useState<boolean>(false);

    // Variables de contexto
    const { saleId, resetSaleStore } = useSaleStore();
    const { employee } = useWorkspace();

    // No permite abrir el modal si no hay productos que cobrar.
    const handleCheckerOpenModalCancelSale = () => {
        console.log('handleCheckerOpenModalCancelSale');
        if (saleId === BigInt(0)) {
            setFloatMessageState({
                type: 'red',
                isActive: true,
                summary: '¡No hay venta que cancelar!',
                description: 'Para cancelar una venta debe haber agregado productos.'
            });
            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
        } else {
            openCancelSaleModal()
        }
    }

    // Finaliza la venta, sin registrar el pago
    const handleCancelSale = async () => {
        setIsCancelSaleLoading(true);
        try {
            const currentSaleId = saleId ?? BigInt(0);
            const currentEmployeeId = BigInt(employee?.employeeId ?? 0);
            const currentCustomerId = BigInt(2);
            const result = await cancelSaleAction(currentSaleId, { customerId: currentCustomerId, employeeId: currentEmployeeId });
            if (!result.ok) {
                setFloatMessageState({
                    type: 'red',
                    isActive: true,
                    summary: '¡Ha ocurrido un error!',
                    description: result.error?.message ?? 'Error al cancelar al venta.'
                });
            } else {
                setFloatMessageState({
                    type: 'green',
                    isActive: true,
                    summary: '¡Exito!',
                    description: 'Venta cancelada.'
                });
                setIsCancelSaleLoading(false);
            }
            setTimeout(() => {
                closeCancelSaleModal();
                setFloatMessageState({});
                resetSaleStore();
            }, 2000);
        } catch (error) {
            setFloatMessageState({
                type: 'red',
                isActive: true,
                summary: '¡Ha ocurrido un error inesperado!',
                description: 'Error al cancelar la venta'
            });
            setTimeout(() => {
                setIsCancelSaleLoading(false);
                setFloatMessageState({});
            }, 4000);
        }
    }
    

    return {
        cancelSaleModal,
        closeCancelSaleModal,
        openCancelSaleModal,
        isCancelSaleLoading,
        handleCheckerOpenModalCancelSale,
        handleCancelSale,
    }
}

export { useCancelSale };
