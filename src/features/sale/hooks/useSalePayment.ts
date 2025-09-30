import { useEffect, useState } from "react";
import { useSalePaymentStore } from "../infraestructure/stores/sale.payment.store";
import { useSaleStore } from "../infraestructure/stores/sale.store";
import { useWorkspace } from "@/shared/hooks/useAuth";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { finishSaleAction } from "../actions/finish-sale.action";
import { RegisterSalePaymentItem } from "../application/dtos/register-sale-payment.dto";
import { registerSalePaymentAction } from "../actions/register-sale-payment.action";
import { useSaleCustomerListStore } from "../infraestructure/stores/sale.customer-list.store";


const useSalePayment = () => {
    // Estados globales
    const {
        closePaymentModal, openPaymentModal, paymentModal, cashAmount, customerChange, setPaymentMethods, paymentMethods, transferNumberRef,
        paidAmount, setCashAmount, setCustomerChange, setPaidAmount, paids, setPaids, resetSalePaymentStore, transferAmount, setTransferAmount
    } = useSalePaymentStore();
    const { customerSelected } = useSaleCustomerListStore();
    //Manejar estado cuanto la peticion este en proceso
    const [isFinishSaleLoading, setIsFinishSaleLoading] = useState<boolean>(false);
    const [isSalePaymentLoading, setIsSalePaymentLoading] = useState<boolean>(false);
    //Estado para lanzar mensajes
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    // Este es el estado que vamos a usar para el array de pagos
    const [salePaids, setSalePaids] = useState<RegisterSalePaymentItem[]>([]);
    // Controlar el mensaje para el pago total
    const [paidAmountMessage, setPaidAmountMessage] = useState({ isError: false, message: '' });

    // Variables de contexto
    const { total, saleId, resetSaleStore } = useSaleStore();
    const { employee } = useWorkspace();

    // Efecto para actualizar los ítems de pago (efectivo y transferencia)
    // y consolidarlos en un solo array `salePaids`.
    useEffect(() => {
        // 1. Crear el nuevo array de pagos de forma inmutable
        const newPaids: RegisterSalePaymentItem[] = [];

        // 2. Lógica para el pago en efectivo
        const filterPaymentMethodCash = paymentMethods.find(item => item.name.toLowerCase() === 'Efectivo'.toLowerCase());
        if (!!filterPaymentMethodCash && cashAmount > 0) {
            const cashItem: RegisterSalePaymentItem = {
                paymentMethodId: filterPaymentMethodCash.paymentMethodId,
                amountPaid: cashAmount,
                referenceNumber: `REF-CASH-${new Date().getTime()}`
            };
            newPaids.push(cashItem);
        }

        // 3. Lógica para el pago en transferencia
        const filterPaymentMethodTransfer = paymentMethods.find(item => item.name.toLowerCase() === 'transferencia'.toLowerCase());
        if (!!filterPaymentMethodTransfer && transferAmount > 0) {
            const transferItem: RegisterSalePaymentItem = {
                paymentMethodId: filterPaymentMethodTransfer.paymentMethodId,
                amountPaid: transferAmount,
                referenceNumber: transferNumberRef !== '' ? transferNumberRef : `REF-TRANSFER-${new Date().getTime()}`
            };
            newPaids.push(transferItem);
        }

        // 4. Actualizar el estado `salePaids` con el nuevo array.
        // Aquí se le pasa el array completo, que reemplazará el estado anterior.
        setSalePaids(newPaids);
        setPaidAmount(Number(cashAmount) + Number(transferAmount));
    }, [cashAmount, transferAmount, transferNumberRef, paymentMethods]);

    // Efecto para calcular el cambio del cliente
    useEffect(() => {
        setCustomerChange(paidAmount - total);
        if (Number(paidAmount) < Number(total)) {
            setPaidAmountMessage({ isError: true, message: `Hacen falta $${Number( total - paidAmount).toFixed(2)}` });
        }
        if ((Number(paidAmount) - Number(total)) >= 0) {
            setPaidAmountMessage({ isError: false, message: `` });
        }
    }, [paidAmount, total, setCustomerChange]);

    // Efecto para resetear el monto cuando el modal se abre
    useEffect(() => {
        if (paymentModal) {
            setCashAmount(total);
            setPaidAmount(total);
        }
    }, [paymentModal, total, setCashAmount, setPaidAmount]);

    // No permite abrir el modal si no hay productos que cobrar.
    const handleCheckerOpenModalFinishSale = () => {
        if (saleId === BigInt(0)) {
            setFloatMessageState({
                type: 'red',
                isActive: true,
                summary: '¡No hay productos en la venta!',
                description: 'Agrega productos a la venta para poder finalizarla.'
            });
            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
        } else {
            openPaymentModal();
        }
    }

    // Finaliza la venta, sin registrar el pago
    const handleFinishSale = async () => {
        setIsFinishSaleLoading(true);
        try {
            const currentSaleId = saleId ?? BigInt(0);
            const currentEmployeeId = BigInt(employee?.employeeId ?? 0);
            const currentCustomerId = BigInt(customerSelected?.customerId ?? 0);
            console.log(customerSelected);
            const result = await finishSaleAction(currentSaleId, { customerId: currentCustomerId, employeeId: currentEmployeeId });
            setIsFinishSaleLoading(false);
            if (!result.ok) {
                setFloatMessageState(result.error ?? {});
                setTimeout(() => {
                    setFloatMessageState({});
                }, 2000);
            } else {
                setFloatMessageState(result.value ?? {});
                setTimeout(() => {
                    closePaymentModal();
                    setFloatMessageState({});
                    resetSaleStore();
                    resetSalePaymentStore();
                }, 2000);
            }
        } catch (error) {
            setFloatMessageState({
                type: 'red',
                isActive: true,
                summary: '¡Ha ocurrido un error inesperado!',
                description: 'Error al finalizar la venta'
            });
            setTimeout(() => {
                setIsFinishSaleLoading(false);
                setFloatMessageState({});
            }, 4000);
        }
    }

    // Finaliza la venta, registrando los pagos dependiendo el metodo de pago
    const handlePaidSale = async () => {
        setIsSalePaymentLoading(true);
        try {
            const currentSaleId = saleId ?? BigInt(0);
            const currentEmployeeId = BigInt(employee?.employeeId ?? 0);
            const currentCustomerId = BigInt(customerSelected?.customerId ?? 0);
            const result = await finishSaleAction(currentSaleId, { customerId: currentCustomerId, employeeId: currentEmployeeId });
            if (!result.ok) {
                setFloatMessageState(result.error ?? {});
            } else {
                const salePaymentResult = await registerSalePaymentAction(saleId, salePaids);
                if (!salePaymentResult.ok) {
                    setFloatMessageState({
                        type: 'red',
                        isActive: true,
                        summary: '¡Ha ocurrido un error!',
                        description: salePaymentResult.error?.message ?? 'Error al finalizar la venta'
                    });
                } else {
                    setFloatMessageState({
                        type: 'green',
                        isActive: true,
                        summary: '¡Exito!',
                        description: 'Venta finalizada'
                    });
                    setTimeout(() => {
                        closePaymentModal();
                        resetSaleStore();
                        resetSalePaymentStore();
                    }, 2000);
                }
            }
            setTimeout(()=>{
                setFloatMessageState({});
            }, 3000);
            setIsSalePaymentLoading(false);
        } catch (error) {
            setFloatMessageState({
                type: 'red',
                isActive: true,
                summary: '¡Ha ocurrido un error inesperado!',
                description: 'Error al finalizar la venta'
            });
            setTimeout(() => {
                setIsSalePaymentLoading(false);
                setFloatMessageState({});
            }, 4000);
        }
    }

    return {
        paymentModal,
        openPaymentModal,
        closePaymentModal,
        total,
        cashAmount,
        transferAmount,
        customerChange,
        paidAmount,
        setCashAmount,
        setPaidAmount,
        setCustomerChange,
        paids,
        handleFinishSale,
        isFinishSaleLoading,
        isSalePaymentLoading,
        floatMessageState,
        handlePaidSale,
        handleCheckerOpenModalFinishSale,
        paidAmountMessage,
    }
}

export { useSalePayment };
