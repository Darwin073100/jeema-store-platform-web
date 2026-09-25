import { useEffect } from "react";
import { useSaleProcessStore } from "../../stores/sale.process.store";
import { useSaleStore } from "../../stores/sale.store";
import { useSaleUIStore } from "../../stores/sale.ui.store"
import { ISale } from "../../interfaces/ISale";
import { IPaymentMethod } from "@/contexts/sale-management/payment-method/presentation/interfaces/IPaymentMethod";

interface Props{
    sale: ISale;
    paymentMethods: IPaymentMethod[];
}

const usePayment = ({ sale, paymentMethods }: Props) => {
    const { openSaleModal, saleModals } = useSaleUIStore();
    const { setCustomerSelected, setPaymentMethods, resetSaleProcessStore } = useSaleProcessStore()
    const { setSale, setSaleId, setTotal, resetSaleStore} = useSaleStore()
    
    useEffect(()=>{
        if(saleModals==='paymentModal'){
            setSale(sale)
            setSaleId(sale.saleId)
            setTotal(sale.totalAmount)
            if(!!sale?.customer){
                setCustomerSelected(sale.customer)
            }
            setPaymentMethods(paymentMethods)
        } else {
            resetSaleProcessStore();
            resetSaleStore();
        }
    },[saleModals]);
    
    return {
        openSaleModal,
    }
}

export { usePayment }
