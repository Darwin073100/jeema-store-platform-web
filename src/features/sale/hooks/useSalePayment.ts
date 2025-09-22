import { useEffect, useState } from "react";
import { useSalePaymentStore } from "../infraestructure/stores/sale.payment.store";
import { useSaleStore } from "../infraestructure/stores/sale.store";
import { useWorkspace } from "@/shared/hooks/useAuth";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { finishSaleAction } from "../actions/finish-sale.action";
import { RegisterSalePaymentItem } from "../application/dtos/register-sale-payment.dto";

const initialStatePaids = [
    {
        paymentMethodId: BigInt(0), // Efectivo
        amountPaid: 0,
        referenceNumber: ``
    },
    {
        paymentMethodId: BigInt(1), // Transferencia
        amountPaid: 0,
        referenceNumber: ``
    }
];

const useSalePayment = () => {
    // Estados globales
    const {
        closePaymentModal, openPaymentModal, paymentModal, cashAmount, customerChange, setPaymentMethods, paymentMethods, transferNumberRef,
        paidAmount, setCashAmount, setCustomerChange, setPaidAmount, paids, setPaids, resetSalePaymentStore, transferAmount, setTransferAmount
    } = useSalePaymentStore();
    //Manejar estado cuanto la peticion este en proceso
    const [isLoading, setIsLoading] = useState<boolean>(false);
    //Estado para lanzar mensajes
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    // Estado para manejar que metodo de pago esta seleccionado
    const [paymentCashItems, setPaymentCashItems] = useState<RegisterSalePaymentItem>(initialStatePaids[0]);
    const [paymentTransferItems, setPaymentTransferItems] = useState<RegisterSalePaymentItem>(initialStatePaids[1]);
    // Este es el estado que vamos a usar para el array de pagos
    const [salePaids, setSalePaidsPaids] = useState<RegisterSalePaymentItem[]>([]);

    // Variables de contexto
    const { total, saleId, resetSaleStore } = useSaleStore();
    const { employee } = useWorkspace();

    // Efecto para controlar el pago en efectivo
    useEffect(()=>{
        // Verificar que existe el pago en efectivo
        const filterPaymentMethodCash = paymentMethods.find(item=> item.name.toLowerCase() === 'Efectivo'.toLowerCase());
        
        
        if (!!filterPaymentMethodCash && cashAmount > 0) {
            setPaymentCashItems({
                ...paymentCashItems,
                amountPaid: cashAmount,
                paymentMethodId: filterPaymentMethodCash.paymentMethodId,
                referenceNumber: `REF-CASH-${new Date().getTime()}`
            });
            setPaids({
                ...paids,
                paidCash: true
            });
        } else {
            setPaymentCashItems(initialStatePaids[0]);
            setPaids({
                ...paids,
                paidCash: false
            });
        }
    },[cashAmount]);
    // Efecto para controlar el pago en transferencia
    useEffect(()=>{        
        // Verificar que existe el pago en efectivo
        const filterPaymentMethodTransfer = paymentMethods.find(item=> item.name.toLowerCase() === 'transferencia'.toLowerCase());

        if (!!filterPaymentMethodTransfer && transferAmount > 0) {
            setPaymentTransferItems({
                ...paymentTransferItems,
                paymentMethodId: filterPaymentMethodTransfer.paymentMethodId,
                amountPaid: transferAmount,
                referenceNumber: transferNumberRef !== '' ? transferNumberRef: `REF-TRANSFER-${new Date().getTime()}`
            });
            setPaids({
                ...paids,
                paidTransfer: true
            });
        } else {
            setPaymentCashItems(initialStatePaids[1]);
            setPaids({
                ...paids,
                paidTransfer: false
            });
        }
    },[transferAmount, transferNumberRef ]);
    

    useEffect(() => {
        setCashAmount(total);
        setPaidAmount(total);
        setCustomerChange(paidAmount - total);
        
        // Verificar que existe el pago en efectivo
        const filterPaymentMethodCash = paymentMethods.find(item=> item.name.toLowerCase() === 'Efectivo'.toLowerCase());
        if (!!filterPaymentMethodCash) {
            setPaymentCashItems({
                ...paymentCashItems,
                amountPaid: cashAmount,
                paymentMethodId: filterPaymentMethodCash.paymentMethodId,
                referenceNumber: `REF-CASH-${new Date().getTime()}`
            });
        } else {
            setPaymentCashItems(initialStatePaids[0]);
        }
        // Verificar que existe el pago en efectivo
        const filterPaymentMethodTransfer = paymentMethods.find(item=> item.name.toLowerCase() === 'transferencia'.toLowerCase());
        if (!!filterPaymentMethodTransfer) {
            setPaymentTransferItems({
                ...paymentTransferItems,
                paymentMethodId: filterPaymentMethodTransfer.paymentMethodId,
                amountPaid: transferAmount,
                referenceNumber: transferNumberRef !== '' ? transferNumberRef: `REF-TRANSFER-${new Date().getTime()}` 
            });
        } else {
            setPaymentCashItems(initialStatePaids[1]);
        }
    }, [paymentModal]);

    useEffect(() => {
        setCustomerChange(paidAmount - total);
    }, [paidAmount]);

    const handleFinishSale = async () => {
        setIsLoading(true);
        try {
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
            } else {
                setFloatMessageState({
                    type: 'green',
                    isActive: true,
                    summary: '¡Exito!',
                    description: 'Venta finalizada'
                });
                setIsLoading(false);
            }
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
        const paids: RegisterSalePaymentItem[] = []
        Number(paymentCashItems.amountPaid) > 0? paids.push(paymentCashItems): null;
        Number(paymentTransferItems.amountPaid) > 0? paids.push(paymentTransferItems): null;

        console.table(paids);
    }

    // const handlePaidSale = async () => {
    //     setIsLoading(true);
    //     try {
    //         const currentSaleId = saleId ?? BigInt(0);
    //         const currentEmployeeId = BigInt(employee?.employeeId ?? 0);
    //         const currentCustomerId = BigInt(2);
    //         const result = await finishSaleAction(currentSaleId, { customerId: currentCustomerId, employeeId: currentEmployeeId });
    //         if (!result.ok) {
    //             setFloatMessageState({
    //                 type: 'red',
    //                 isActive: true,
    //                 summary: '¡Ha ocurrido un error!',
    //                 description: result.error?.message ?? 'Error al finalizar la venta'
    //             });
    //         } else {
    //             const currentTotalSale = result.value?.totalAmount ?? 0;
                
    //             setFloatMessageState({
    //                 type: 'green',
    //                 isActive: true,
    //                 summary: '¡Exito!',
    //                 description: 'Venta finalizada'
    //             });
    //             setIsLoading(false);
    //         }
    //         setTimeout(()=>{
    //             closePaymentModal();
    //             setFloatMessageState({});
    //             resetSaleStore();
    //             resetSalePaymentStore();
    //         }, 2000);
    //     } catch (error) {
    //         setFloatMessageState({
    //             type: 'red',
    //             isActive: true,
    //             summary: '¡Ha ocurrido un error inesperado!',
    //             description: 'Error al finalizar la venta'
    //         });
    //         setTimeout(()=>{
    //             setIsLoading(false);
    //             setFloatMessageState({});
    //         }, 4000);
    //     }
    // }

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
        handlePaidSale
    }
}

export { useSalePayment };
