'use client'
import { useEffect } from "react";
import { SaleEntity } from "../../../../../../features/sale/domain/entities/sale-entity"
import { useSaleProcessStore } from "../../stores/sale.process.store";
import { useSaleStore } from "../../stores/sale.store";
import { useSaleUIStore } from "../../stores/sale.ui.store"
import { useRouter } from "next/navigation";

interface Props{
    sale: SaleEntity;
}

const useSaleContinue = ({ sale }: Props) => {
    const router = useRouter();
    const { loading, initLoading, finishLoading } = useSaleUIStore();
    const { setCustomerSelected, setPaymentMethods, resetSaleProcessStore } = useSaleProcessStore()
    const { setSale, setSaleId, setTotal, resetSaleStore} = useSaleStore()
    useEffect(()=>{
        finishLoading();
    },[]);
    const handleSaleContinue = ()=>{
        initLoading('saleContinue');
        setSale(sale)
        setSaleId(sale.saleId)
        setTotal(sale.totalAmount)
        if(!!sale?.customer){
            setCustomerSelected(sale.customer)
        }
        router.push('/sale/new');
    }
    
    return {
        handleSaleContinue,
        loading,
    }
}

export { useSaleContinue }
