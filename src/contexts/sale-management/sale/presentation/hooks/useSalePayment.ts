import { useEffect, useState } from "react";
import { useWorkspace } from "@/shared/presentation/hooks/auth/useAuth";
import { finishSaleAction } from "../actions/finish-sale.action";
import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";
import { useSaleUIStore } from "../stores/sale.ui.store";
import { useSaleProcessStore } from "../stores/sale.process.store";
import { useSaleStore } from "../stores/sale.store";
import { CalculateSaleDTO } from "../../application/dtos/calculate-sale.dto";
import { RegisterSalePaymentDTO } from "@/contexts/sale-management/sale-payment/application/dtos/register-sale-payment.dto";
import useTicketSale from "./useTicketSale";


const useSalePayment = () => {
    const { handlePrint } = useTicketSale({});
    const { 
        setFloatMessageState, closeSaleModal, openSaleModal, saleModals, loading, 
        initLoading, finishLoading, setViewTicket
    } = useSaleUIStore();
    // Estados globales
    const {
         cashAmount, customerChange, paymentMethods, transferNumberRef, customerSelected, customers, setCustomerSelected,
        paidAmount, setCashAmount, setCustomerChange, setPaidAmount, paids, resetSaleProcessStore, transferAmount,
    } = useSaleProcessStore();
    // Este es el estado que vamos a usar para el array de pagos
    const [salePaids, setSalePaids] = useState<RegisterSalePaymentDTO[]>([]);
    // Controlar el mensaje para el pago total
    const [paidAmountMessage, setPaidAmountMessage] = useState({ isError: false, message: '' });

    // Variables de contexto
    const { total, saleId, resetSaleStore, cashSessionActive } = useSaleStore();
    const { employee } = useWorkspace();

    // Efecto para actualizar los ítems de pago (efectivo y transferencia)
    // y consolidarlos en un solo array `salePaids`.
    useEffect(() => {
        // 1. Crear el nuevo array de pagos de forma inmutable
        const newPaids: RegisterSalePaymentDTO[] = [];

        // 2. Lógica para el pago en efectivo
        const filterPaymentMethodCash = paymentMethods.find(item => item.name.toLowerCase() === 'Efectivo'.toLowerCase());
        if (!!filterPaymentMethodCash && cashAmount > 0) {
            const cashItem: RegisterSalePaymentDTO = {
                paymentMethodId: filterPaymentMethodCash.paymentMethodId ?? BigInt(1),
                amountPaid: cashAmount,
                saleId,
                referenceNumber: null,
            };
            newPaids.push(cashItem);
        }

        // 3. Lógica para el pago en transferencia
        const filterPaymentMethodTransfer = paymentMethods.find(item => item.name.toLowerCase() === 'transferencia'.toLowerCase());
        if (!!filterPaymentMethodTransfer && transferAmount > 0) {
            const transferItem: RegisterSalePaymentDTO = {
                paymentMethodId: filterPaymentMethodTransfer.paymentMethodId,
                amountPaid: transferAmount,
                saleId,
                referenceNumber: transferNumberRef !== '' ? transferNumberRef : `REF-TRANSFER-${new Date().getTime()}`
            };
            newPaids.push(transferItem);
        }

        // 4. Actualizar el estado `salePaids` con el nuevo array.
        // Aquí se le pasa el array completo, que reemplazará el estado anterior.
        setSalePaids(newPaids);
        const newPaidAmount = Number(cashAmount) + Number(transferAmount);
        if (paidAmount !== newPaidAmount) {
            setPaidAmount(newPaidAmount);
        }
    }, [cashAmount, transferAmount, transferNumberRef, paymentMethods.length, paidAmount]);

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
        if (saleModals==='paymentModal') {
            setCashAmount(total);
            setPaidAmount(total);
        }
    }, [saleModals, total, setCashAmount, setPaidAmount]);

    // No permite abrir el modal si no hay productos que cobrar.
    const handleCheckerOpenModalFinishSale = () => {
        if(!cashSessionActive){
            setFloatMessageState({
                summary: '404: ¡Error! 😢',
                description: 'Debes aperturar caja para poder continuar.',
                type: 'red',
                isActive: true
            });
            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
            return;
        }
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
            openSaleModal('paymentModal');
        }
    }

    // Finaliza la venta, sin registrar el pago
    const handleFinishSale = async () => {
        if(!cashSessionActive){
            setFloatMessageState({
                summary: '404: ¡Error! 😢',
                description: 'Debes aperturar caja para poder vender',
                type: 'red',
                isActive: true
            });
            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
            return;
        }
        initLoading('finishSaleLoading');
        try {
            const currentSaleId = saleId ?? BigInt(0);
            const currentEmployeeId = BigInt(employee?.employeeId ?? 0);
            const currentCustomerId = BigInt(customerSelected?.customerId ? customerSelected.customerId: customers.filter(item=> item.saleDefault===true)[0].customerId ?? BigInt(0));
            
            const result = await finishSaleAction({ 
                saleId: currentSaleId,
                customerId: currentCustomerId, 
                employeeId: currentEmployeeId, 
                cashRegisterId: cashSessionActive.cashRegisterId, 
                status: SaleStatusEnum.PENDING,
                inAmount: paidAmount,
                notes: null,
                salePayments: []
            });

            finishLoading();
            if (!result.ok) {
                setFloatMessageState({
                    type: 'red',
                    isActive: true,
                    summary: `${result.error?.statusCode}: ${result.error?.error ?? '¡Ha ocurrido un error!'}`,
                    description: result.error?.message ?? 'Error al finalizar la venta'
                });
                setTimeout(() => {
                    setFloatMessageState({});
                }, 2000);
            } else {
                setFloatMessageState({
                    summary: 'Venta pendiente',
                    description: 'Venta guardada como pendiente',
                    isActive: true,
                    type: 'yellow', 
                });
                setTimeout(() => {
                    closeSaleModal();
                    setFloatMessageState({});
                    resetSaleStore();
                    resetSaleProcessStore();
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
                finishLoading();
                setFloatMessageState({});
            }, 4000);
        }
    }

    // Finaliza la venta, registrando los pagos dependiendo el metodo de pago
    const handlePaidSale = async () => {
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
        initLoading('salePaymentLoading');
        try {
            const currentSaleId = saleId ?? BigInt(0);
            const currentEmployeeId = BigInt(employee?.employeeId ?? 0);
            const currentCustomerId = BigInt(customerSelected?.customerId ? customerSelected.customerId: customers.filter(item=> item.saleDefault===true)[0].customerId ?? BigInt(0));
            const dto:CalculateSaleDTO = {
                saleId: currentSaleId,
                customerId: currentCustomerId, 
                employeeId: currentEmployeeId, 
                cashRegisterId: cashSessionActive?.cashRegisterId, 
                inAmount: paidAmount, 
                notes: null,
                status: SaleStatusEnum.COMPLETED,
                salePayments: salePaids ?? []
            }
            const result = await finishSaleAction(dto);
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
                        description: 'Se ha cobrado la venta'
                    });
                    resetSaleStore();
                    resetSaleProcessStore();
                    setTimeout(() => {
                        closeSaleModal();
                        //! Ejecutar el ticket
                        handlePrint(result.value.saleId);
                    }, 1000);
                }
            setTimeout(()=>{
                setFloatMessageState({});
            }, 2000);
            finishLoading();
        } catch (error) {
            setFloatMessageState({
                type: 'red',
                isActive: true,
                summary: '¡Ha ocurrido un error inesperado!',
                description: 'Error al finalizar la venta'
            });
            setTimeout(() => {
                finishLoading();
                setFloatMessageState({});
            }, 4000);
        }
    }

    return {
        saleModals,
        openSaleModal,
        closeSaleModal,
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
        loading,
        handlePaidSale,
        handleCheckerOpenModalFinishSale,
        paidAmountMessage,
    }
}

export { useSalePayment };
