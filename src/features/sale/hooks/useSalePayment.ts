import { useEffect, useState } from "react";
import { useSalePaymentStore } from "../infraestructure/stores/sale.payment.store";
import { useSaleStore } from "../infraestructure/stores/sale.store";

const useSalePayment = () => {
    const { closePaymentModal, openPaymentModal, paymentModal } = useSalePaymentStore();
    const { total } = useSaleStore();
    const [cashAmount, setCashAmount] = useState<number>(0);
    const [paidAmount, setPaidAmount] = useState<number>(0);
    const [custumerChange, setCustumerChange] = useState<number>(0);

    useEffect(() => {
        setCashAmount(total);
        setPaidAmount(total);
        setCustumerChange(paidAmount - total);
    }, [paymentModal]);

    useEffect(() => {
        setCustumerChange(paidAmount - total);
    }, [paidAmount]);

    return {
        paymentModal,
        openPaymentModal,
        closePaymentModal,
        total, 
        cashAmount,
        custumerChange,
        paidAmount,
        setCashAmount,
        setPaidAmount,
        setCustumerChange,
    }
}

export { useSalePayment };
