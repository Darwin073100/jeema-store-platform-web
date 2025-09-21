import { useEffect, useState } from "react";
import { useSalePaymentStore } from "../infraestructure/stores/sale.payment.store";
import { useSaleStore } from "../infraestructure/stores/sale.store";
import { useWorkspace } from "@/shared/hooks/useAuth";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { finishSaleAction } from "../actions/finish-sale.action";

const useSalePayment = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    // Estado para manejar que metodo de pago esta seleccionado
    const {
        closePaymentModal, openPaymentModal, paymentModal, cashAmount, customerChange, setPaymentMethods, paymentMethods,
        paidAmount, setCashAmount, setCustomerChange, setPaidAmount, paids, setPaids, resetSalePaymentStore, transferAmount, setTransferAmount
    } = useSalePaymentStore();

    const { total, saleId, resetSaleStore } = useSaleStore();
    const { employee } = useWorkspace();

    useEffect(()=>{        
        if (transferAmount > 0) {
            setPaids({
                ...paids,
                paidTransfer: true
            });
        } else {
            setPaids({
                ...paids,
                paidTransfer: false
            });
        }
    },[transferAmount ]);

    useEffect(()=>{
        if (cashAmount > 0) {
            setPaids({
                ...paids,
                paidCash: true
            });
        } else {
            setPaids({
                ...paids,
                paidCash: false
            });
        }
    },[cashAmount]);

    useEffect(() => {
        setCashAmount(total);
        setPaidAmount(total);
        setCustomerChange(paidAmount - total);
    }, [paymentModal]);

    useEffect(() => {
        setCustomerChange(paidAmount - total);
    }, [paidAmount]);

    const handleFinishSale = async () => {
        console.log('handleFinishSale');
        setIsLoading(true);
        try {
            const currentSaleId = saleId ?? BigInt(0);
            const currentEmployeeId = BigInt(employee?.employeeId ?? 0);
            const currentCustomerId = BigInt(2);
            const result = await finishSaleAction(currentSaleId, { customerId: currentCustomerId, employeeId: currentEmployeeId });
            console.log(result);
            if (result.ok=== false) {
                setFloatMessageState({
                    type: 'red',
                    isActive: true,
                    summary: '¡Ha ocurrido un error!',
                    description: result.error?.message ?? 'Error al finalizar la venta'
                });
            }
            setFloatMessageState({
                type: 'green',
                isActive: true,
                summary: '¡Exito!',
                description: 'Venta finalizada'
            });
            setIsLoading(false);
            setTimeout(()=>{
                closePaymentModal();
                setFloatMessageState({});
                resetSaleStore();
                resetSalePaymentStore();
            }, 2000);
        } catch (error) {
            setFloatMessageState({
                type: 'red',
                isActive: true,
                summary: '¡Ha ocurrido un error inesperado!',
                description: 'Error al finalizar la venta'
            });
            setTimeout(()=>{
                setIsLoading(false);
                setFloatMessageState({});
            }, 4000);
        }
    }

    const handlePaidSale = async () => {
        try {
            setIsLoading(true);
            const currentSaleId = saleId ?? BigInt(0);
            const currentEmployeeId = BigInt(employee?.employeeId ?? 0);
            const currentCustomerId = BigInt(2);
            const result = await finishSaleAction(currentSaleId, { customerId: currentCustomerId, employeeId: currentEmployeeId });
            if (!result.ok) {
                setFloatMessageState({
                    type: 'red',
                    isActive: true,
                    summary: '¡Ha ocurrido un error!',
                    description: result.error?.message ?? 'Error al finalizar la venta'
                });
            }
        } catch (error) {
            setFloatMessageState({
                type: 'red',
                isActive: true,
                summary: '¡Ha ocurrido un error inesperado!',
                description: 'Error al finalizar la venta'
            });
        }
    }

    return {
        paymentModal,
        openPaymentModal,
        closePaymentModal,
        total,
        cashAmount,
        customerChange,
        paidAmount,
        setCashAmount,
        setPaidAmount,
        setCustomerChange,
        paids,
        handleFinishSale,
        isLoading,
        floatMessageState,
    }
}

export { useSalePayment };
