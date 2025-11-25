import { useState } from "react";
import { useSaleStore } from "../infraestructure/stores/sale.store";
import { useWorkspace } from "@/shared/hooks/useAuth";
import { cancelSaleAction } from "../actions/cancel-sale.action";
import { useSaleUIStore } from "../infraestructure/stores/sale.ui.store";
import { useSaleProcessStore } from "../infraestructure/stores/sale.process.store";


const useCancelSale = () => {

    // Estado global de la UI de Ventas
    const { 
        setFloatMessageState, saleModals, closeSaleModal, openSaleModal, loading, initLoading,
        finishLoading,
    } = useSaleUIStore();

    // Variables de contexto
    const { saleId, resetSaleStore, cashSessionActive } = useSaleStore();
    const { customers } = useSaleProcessStore();
    const { employee } = useWorkspace();

    // No permite abrir el modal si no hay productos que cobrar.
    const handleCheckerOpenModalCancelSale = () => {

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
            openSaleModal('cancelSaleModal')
        }
    }

    // Finaliza la venta, sin registrar el pago
    const handleCancelSale = async () => {
        if(!cashSessionActive){
            setFloatMessageState({
                summary: '404: ¡Error! 😢',
                description: 'Debes aperturar caja para poder continuar',
                type: 'red',
                isActive: true
            });
            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
            return;
        }
        initLoading('cancelSaleLoading');
        try {
            const currentSaleId = saleId ?? BigInt(0);
            const currentEmployeeId = BigInt(employee?.employeeId ?? 0);
            const currentCustomerId = BigInt(customers.filter(item=> item.saleDefault===true)[0].customerId ?? 0);
            const result = await cancelSaleAction(currentSaleId, { 
                customerId: currentCustomerId, 
                employeeId: currentEmployeeId,
                cashRegisterId: cashSessionActive.cashRegisterId,
                inAmount: 0,
            });
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
                finishLoading();
            }
            setTimeout(() => {
                closeSaleModal();
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
                finishLoading();
                setFloatMessageState({});
            }, 4000);
        }
    }
    

    return {
        saleModals,
        closeSaleModal,
        openSaleModal,
        loading,
        handleCheckerOpenModalCancelSale,
        handleCancelSale,
    }
}

export { useCancelSale };
