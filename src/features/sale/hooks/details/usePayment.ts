import { useEffect } from "react";
import { SaleEntity } from "../../domain/entities/sale-entity"
import { useSaleProcessStore } from "../../infraestructure/stores/sale.process.store";
import { useSaleStore } from "../../infraestructure/stores/sale.store";
import { useSaleUIStore } from "../../infraestructure/stores/sale.ui.store"
import { PaymentMethodEntity } from "@/features/payment-method/domain/entities/payment-method-entity";

interface Props{
    sale: SaleEntity;
    paymentMethods: PaymentMethodEntity[];
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
